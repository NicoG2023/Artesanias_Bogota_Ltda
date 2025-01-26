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

const generarURLFirmada = (blobName, permisos, expiracionEnHoras = 5) => {
  try {
    const sasOptions = {
      containerName: containerClient.containerName,
      blobName,
      permissions: permisos,
      expiresOn: new Date(new Date().valueOf() + 3600 * 5000), //Expira en 5 horas
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();
    return `https://${accountName}.blob.core.windows.net/${containerClient.containerName}/${blobName}?${sasToken}`;
  } catch (error) {
    console.error("Error al generar URL firmada:", error.message);
    return null;
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
        urlFirmada = await generarURLFirmada(archivo, "r");
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

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  desactivarProducto,
};
