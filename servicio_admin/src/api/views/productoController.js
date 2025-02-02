const {
  Producto,
  REL_ProductoCategoria,
  Categoria,
  Inventario,
} = require("../../models");
const productoSerializer = require("../serializers/productoSerializer");
const { containerClient } = require("../../config/blob-storage");
const {
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { generarSKU } = require("../../models/Producto");
const { Op, Sequelize } = require("sequelize");
require("dotenv").config();
const { getPuntosVentaByIds } = require("../../grpc/puntoVentaClientGrpc");
const sequelize = require("../../config/database");
const { getSignedUrl } = require("../../utils/cacheUtils");

// Cargar las credenciales desde el archivo .env
const accountName = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error(
    "Faltan AZURE_ACCOUNT_NAME o AZURE_ACCOUNT_KEY en el archivo .env"
  );
}

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

//Vista para obtener 9 productos más vendidos y con mejor rating
const obtenerProductosCarousel = async (req, res) => {
  try {
    const limit = 9; // Solo queremos 9 productos
    const offset = 0; // No paginamos, solo la primera página

    // -- PASO 1: OBTENER IDs DISTINTOS DE LOS PRODUCTOS CON MEJOR RATING --
    const allDistinctIds = await Producto.findAll({
      attributes: ["id"],
      where: { es_activo: true }, // Solo productos activos
      include: [
        {
          model: Inventario,
          as: "inventario",
          required: false, // LEFT JOIN para obtener stock si existe
        },
      ],
      order: [["rating", "DESC"]],
      limit, // Tomamos solo los primeros 9 productos con mejor rating
      raw: true,
      subQuery: false,
    });

    // Extraer IDs únicos
    const productIds = allDistinctIds.map((row) => row.id);

    // -- PASO 2: OBTENER LA INFORMACIÓN DETALLADA DE ESOS PRODUCTOS --
    const productos = await Producto.findAll({
      where: {
        id: { [Op.in]: productIds },
      },
      include: [
        {
          model: Inventario,
          as: "inventario",
          required: false,
        },
      ],
      order: [["rating", "DESC"]],
      subQuery: false,
    });

    // -- PASO 3: PROCESAR DATOS --
    const productosProcesados = productos.map((producto) => {
      const productoJSON = producto.toJSON();

      // Generar URL firmada si usas Blob Azure
      let urlFirmada = productoJSON.imagen;
      if (productoJSON.imagen) {
        const archivo = productoJSON.imagen.split("/").pop();
        urlFirmada = getSignedUrl(archivo, "r");
      }

      // Calcular stock total basado en el inventario
      let stock = 0;
      if (productoJSON.inventario && productoJSON.inventario.length > 0) {
        stock = productoJSON.inventario.reduce(
          (total, item) => total + item.cantidad,
          0
        );
      }

      return {
        id: productoJSON.id,
        nombre: productoJSON.nombre,
        sku: productoJSON.sku,
        precio: productoJSON.precio,
        descripcion: productoJSON.descripcion,
        imagen: productoJSON.imagen,
        es_activo: productoJSON.es_activo,
        color: productoJSON.color,
        talla: productoJSON.talla,
        rating: productoJSON.rating,
        stock,
      };
    });

    return res.json({
      data: productosProcesados,
    });
  } catch (error) {
    console.error("Error en obtenerProductosCarousel:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener los productos del carousel" });
  }
};

//Vista para obtener productos con paginación y filtrado
const obtenerProductos = async (req, res) => {
  try {
    const {
      page = 1,
      search = "",
      categoria = null,
      color = null,
      minPrecio = 0,
      maxPrecio = 100000000,
      // Nuevo query param para filtrar por punto de venta
      puntoVentaId = null,
    } = req.query;

    // Número de productos por página
    const limit = 20;
    const currentPage = Number(page);
    const offset = (currentPage - 1) * limit;

    // Convertir puntoVentaId a número si llega
    const pvIdNum = puntoVentaId ? Number(puntoVentaId) : null;

    // Parsear categorías (pueden llegar en un array o como "1,2,3")
    let categoriaArray = [];
    if (categoria) {
      categoriaArray = Array.isArray(categoria)
        ? categoria.map(Number)
        : categoria.split(",").map(Number);
    }

    // Parsear colores
    let colorArray = [];
    if (color) {
      colorArray = Array.isArray(color) ? color : color.split(",");
    }

    // Condiciones base para la tabla Producto
    const where = {
      ...(search && { nombre: { [Op.like]: `%${search}%` } }),
      precio: {
        [Op.gte]: minPrecio,
        [Op.lte]: maxPrecio,
      },
      ...(colorArray.length > 0 && { color: { [Op.in]: colorArray } }),
    };

    // Include base
    const includeBase = [
      {
        model: Categoria,
        as: "categorias",
        attributes: ["id", "nombre"],
        through: {
          model: REL_ProductoCategoria,
          as: "relaciones",
          attributes: [], // No necesitamos nada de la tabla pivote
        },
        ...(categoriaArray.length > 0 && {
          where: { id: { [Op.in]: categoriaArray } },
        }),
      },
      {
        // Incluir inventario para poder mostrar la cantidad
        model: Inventario,
        as: "inventario",
        required: false, // LEFT JOIN (queremos ver también sin inventario)
        ...(pvIdNum && {
          where: {
            punto_venta_fk: pvIdNum,
          },
        }),
      },
    ];

    // -- PASO 1: OBTENER TODOS LOS IDs DISTINTOS DE PRODUCTO (SIN ORDER, SIN PAGINACIÓN) --
    const allDistinctIds = await Producto.findAll({
      attributes: ["id"], // Solo necesitamos el ID
      where,
      include: includeBase,
      distinct: true,
      raw: true, // Retorna filas planas, no instancias
      subQuery: false, // Evita subconsultas
    });

    // Extraer IDs en un array (los productos únicos que cumplen los filtros)
    const productIds = allDistinctIds.map((row) => row.id);

    // total de productos distintos que cumplen la condición
    const total = productIds.length;

    // Calcular las páginas
    const totalPages = Math.ceil(total / limit);

    // IDs para esta página
    const idsForPage = productIds.slice(offset, offset + limit);

    // -- ORDEN --
    // rating DESC, luego stock DESC, luego nombre ASC
    // Para stock, usamos COALESCE("inventario"."cantidad", 0) y subQuery false
    let order = [
      ["rating", "DESC"],
      ["nombre", "ASC"],
    ];
    if (pvIdNum) {
      order = [
        ["rating", "DESC"],
        [Sequelize.literal('COALESCE("inventario"."cantidad", 0)'), "DESC"],
        ["nombre", "ASC"],
      ];
    }

    // -- PASO 2: CONSULTA FINAL PARA ESOS IDs --
    const productos = await Producto.findAll({
      where: {
        id: { [Op.in]: idsForPage },
      },
      include: includeBase,
      order,
      subQuery: false, // Necesario para que no genere subconsulta con ORDER en PG
      distinct: true, // Opcional. A veces lo mantenemos por precaución.
    });

    // Mapeo final: firmar URLS, calcular stock, etc.
    const productosProcesados = [];
    for (const producto of productos) {
      const productoJSON = producto.toJSON();

      // Generar URL firmada si usas Blob Azure
      let urlFirmada = productoJSON.imagen;
      if (productoJSON.imagen) {
        const archivo = productoJSON.imagen.split("/").pop();
        urlFirmada = await getSignedUrl(archivo, "r");
      }

      // Calcular stock con base en inventario (puede haber 0 o 1 registros del array)
      let stock = 0;
      if (productoJSON.inventario && productoJSON.inventario.length > 0) {
        stock = productoJSON.inventario[0].cantidad || 0;
      }

      productosProcesados.push({
        id: productoJSON.id,
        nombre: productoJSON.nombre,
        sku: productoJSON.sku,
        precio: productoJSON.precio,
        descripcion: productoJSON.descripcion,
        imagen: urlFirmada || productoJSON.imagen,
        es_activo: productoJSON.es_activo,
        color: productoJSON.color,
        talla: productoJSON.talla,
        rating: productoJSON.rating,
        categorias: productoJSON.categorias || [],
        stock,
      });
    }

    // Respuesta final
    return res.json({
      data: productosProcesados,
      pagination: {
        total,
        page: currentPage,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error en obtenerProductos:", error);
    return res.status(500).json({ error: "Error al obtener los productos" });
  }
};

//Configuración de multer para recibir archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext === ".jpg" ||
      ext === ".jpeg" ||
      ext === ".png" ||
      ext === ".webp"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Solo se permiten imágenes en formato JPG, JPEG, PNG o WEBP")
      );
    }
  },
}).single("imagen"); //el campo en el formulario debe llamarse "imagen"

// Vista para crear un nuevo producto
const agregarProducto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error en multer:", err.message);
      return res.status(400).json({ error: err.message });
    }

    const {
      nombre,
      precio,
      descripcion,
      es_activo,
      categoria_fk,
      color,
      talla,
    } = req.body;

    try {
      // Crear una instancia sin guardar para ejecutar las validaciones
      const nuevoProducto = Producto.build({
        nombre,
        precio,
        descripcion,
        es_activo,
        categoria_fk,
        color,
        talla,
      });

      // Ejecutar el hook beforeCreate manualmente
      await Producto.runHooks("beforeCreate", nuevoProducto);

      // Subida de la imagen a Azure Blob Storage solo si las validaciones pasan
      let imagenUrl;
      if (req.file) {
        const blobName = `${uuidv4()}${path.extname(req.file.originalname)}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        imagenUrl = blockBlobClient.url;
      } else {
        imagenUrl =
          "https://artesaniasbogota2024.blob.core.windows.net/imagenes-artesanias/default-product.webp";
      }

      // Asignar la URL de la imagen y guardar en la base de datos
      nuevoProducto.imagen = imagenUrl;
      await nuevoProducto.save();

      res.status(201).json(productoSerializer(nuevoProducto));
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      res.status(500).json({
        error: "Error al agregar el producto",
        details: error.message,
      });
    }
  });
};

// Vista para editar un producto *existente*
const editarProducto = async (req, res) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const {
      nombre,
      precio,
      descripcion,
      es_activo,
      categoria_fk,
      color,
      talla,
    } = req.body;

    try {
      const producto = await Producto.findByPk(id);

      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      //Actualizar los datos del producto
      producto.set({
        nombre,
        precio,
        descripcion,
        es_activo,
        categoria_fk,
        color,
        talla,
      });

      // Generar el nuevo SKU
      producto.sku = generarSKU(producto);

      // Guardar el producto (validaciones incluidas)
      await producto.save();

      // Si hay una nueva imagen, subirla y actualizar el campo "imagen"
      if (req.file) {
        const blobName = `${uuidv4()}${path.extname(req.file.originalname)}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        //Actualizar la URL de la imagen en la BD
        producto.imagen = blockBlobClient.url;
        await producto.save();
      }
      res.status(200).json(productoSerializer(producto));
    } catch (error) {
      console.error("Error al editar el producto:", error);
      res
        .status(500)
        .json({ error: "Error al editar el producto", details: error.message });
    }
  });
};

//Vista para desactivar un producto (equivalente a eliminarlo)
const desactivarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    //Buscar el producto por su ID
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    //Actualizar el campo "es_activo" a false
    await producto.update({ es_activo: false });

    res.status(200).json({
      message: "Producto desactivado exitosamente",
      data: productoSerializer(producto),
    });
  } catch (error) {
    res.status(500).json({ error: "Error al desactivar el producto" });
  }
};

async function agregarProductosBulk(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const { productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      console.error("Error en agregarProductosBulk: no hay productos");
      await transaction.rollback();
      return res.status(400).json({
        error: "Debes enviar un arreglo de productos en 'productos'.",
      });
    }

    // 1) Recolectar IDs de punto de venta
    const pvIdsSet = new Set();
    // 2) Recolectar IDs de categoría
    const catIdsSet = new Set();

    for (const p of productos) {
      // Inventarios
      if (Array.isArray(p.inventarios)) {
        for (const inv of p.inventarios) {
          if (inv.punto_venta_fk) {
            pvIdsSet.add(inv.punto_venta_fk);
          }
        }
      }
      // Categorías
      if (Array.isArray(p.categorias)) {
        for (const cId of p.categorias) {
          catIdsSet.add(cId);
        }
      }
    }

    const puntoVentaIds = Array.from(pvIdsSet);
    const categoriaIds = Array.from(catIdsSet);

    // 2a) Validar puntos de venta por gRPC (si existen)
    let dictPuntosVenta = {};
    if (puntoVentaIds.length > 0) {
      const puntosVentaRemotos = await getPuntosVentaByIds(puntoVentaIds);
      for (const pv of puntosVentaRemotos) {
        dictPuntosVenta[pv.id] = pv; // {id, nombre, tipo, direccion}
      }
    }

    // 2b) Validar categorías en la tabla local "Categoria"
    let dictCategorias = {};
    if (categoriaIds.length > 0) {
      const categoriasEncontradas = await Categoria.findAll({
        where: { id: categoriaIds },
        transaction,
      });
      for (const cat of categoriasEncontradas) {
        dictCategorias[cat.id] = cat; // { id, nombre, ... }
      }
    }

    // 3) Crear productos y relaciones
    const resultados = [];

    for (const prodData of productos) {
      const {
        nombre,
        precio: precioString,
        descripcion,
        es_activo,
        color,
        talla,
        imagenBase64,
        rating,
        inventarios,
        categorias, // array de IDs
      } = prodData;

      //validar y convertir el precio
      const precio = parsePrecioColombiano(precioString);

      if (isNaN(precio) || precio < 0) {
        console.error("Precio inválido para el producto:", nombre);
        await transaction.rollback();
        return res.status(400).json({
          error: `Precio inválido para el producto: ${nombre}. Debe ser un valor positivo en formato colombiano (ej: 50.000).`,
        });
      }

      // Validar el rating
      if (rating !== undefined && (rating < 0 || rating > 5)) {
        console.error("Rating inválido para el producto:", nombre);
        await transaction.rollback();
        return res.status(400).json({
          error: `Rating inválido para el producto: ${nombre}. Debe ser un valor entre 0 y 5.`,
        });
      }

      // Subir imagen (si existe)
      let imagenUrl = "https://.../default-product.webp";
      if (imagenBase64) {
        const base64Regex = /^data:.*;base64,(.*)$/;
        const match = imagenBase64.match(base64Regex);
        if (!match) {
          await transaction.rollback();
          throw new Error(
            `Formato de imagenBase64 inválido para el producto: ${nombre}`
          );
        }
        const base64Data = match[1];
        const buffer = Buffer.from(base64Data, "base64");

        const extension = ".png";
        const blobName = `${uuidv4()}${extension}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(buffer, {
          blobHTTPHeaders: { blobContentType: "image/png" },
        });

        imagenUrl = blockBlobClient.url;
      }

      // Crear producto
      const nuevoProducto = await Producto.create(
        {
          nombre,
          precio,
          descripcion,
          es_activo: es_activo != null ? es_activo : true,
          color,
          talla,
          imagen: imagenUrl,
          rating: rating || 0,
        },
        { transaction }
      );

      if (!nuevoProducto || !nuevoProducto.id) {
        await transaction.rollback();
        throw new Error(`No se pudo obtener el ID del producto ${nombre}`);
      }

      console.log(`Producto creado con ID: ${nuevoProducto.id}`);

      // Manejo de inventario
      if (Array.isArray(inventarios) && inventarios.length > 0) {
        for (const inv of inventarios) {
          const { punto_venta_fk, nombre_punto_venta, cantidad } = inv;

          // Validar punto de venta
          const pvRemoto = dictPuntosVenta[punto_venta_fk];
          if (!pvRemoto) {
            await transaction.rollback();
            throw new Error(
              `El punto de venta con ID ${punto_venta_fk} no existe (producto: ${nombre}).`
            );
          }
          if (nombre_punto_venta !== pvRemoto.nombre) {
            console.error("El nombre del PV no coincide con la base");
            await transaction.rollback();
            throw new Error(
              `El nombre del PV no coincide con la base (producto: ${nombre}).`
            );
          }

          // Crear registro de inventario
          await Inventario.create(
            {
              producto_fk: nuevoProducto.id,
              punto_venta_fk,
              nombre_punto_venta,
              cantidad,
            },
            { transaction }
          );
        }
      }

      resultados.push(nuevoProducto);
    }
    await transaction.commit();

    for (const nuevoProducto of resultados) {
      if (
        Array.isArray(nuevoProducto.categorias) &&
        nuevoProducto.categorias.length > 0
      ) {
        for (const catId of nuevoProducto.categorias) {
          const catObj = dictCategorias[catId];
          if (!catObj) {
            console.error(`La categoría con ID ${catId} no existe.`);
            continue;
          }
          await REL_ProductoCategoria.create({
            categoria_fk: catId,
            producto_fk: nuevoProducto.id,
          });
        }
      }
    }

    return res.status(201).json({
      message: "Productos creados correctamente",
      data: resultados,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error en agregarProductosBulk:", error);
    return res.status(500).json({
      error: "Error al crear productos en lote",
      detalle: error.message || error,
    });
  }
}

// Función para convertir precios en formato colombiano a número
function parsePrecioColombiano(precioString) {
  if (typeof precioString !== "string") {
    throw new Error("El precio debe ser un string.");
  }
  const precioLimpio = precioString.replace(/\./g, ""); // Elimina los puntos
  const precioEntero = parseInt(precioLimpio, 10) * 100; // Multiplica por 100 para convertir a centavos
  if (isNaN(precioEntero)) {
    throw new Error("Formato de precio inválido.");
  }
  return precioEntero;
}

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  desactivarProducto,
  agregarProductosBulk,
  obtenerProductosCarousel,
};
