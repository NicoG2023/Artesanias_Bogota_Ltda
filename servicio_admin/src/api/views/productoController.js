const { Producto, Categoria } = require("../../models");
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
const { Op } = require("sequelize");
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
    } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    //Condiciones de búsqueda y filtrado
    const where = {
      ...(search && { nombre: { [Op.like]: `%${search}%` } }),
      ...(categoria && { categoria_fk: categoria }),
      ...(color && { color }),
      precio: {
        [Op.gte]: minPrecio,
        [Op.lte]: maxPrecio,
      },
    };

    // Se realiza la búsqueda con paginación y las relaciones necesarias
    const { rows: productos, count: total } = await Producto.findAndCountAll({
      where,
      include: [
        { model: Categoria, as: "categorias", attributes: ["id", "nombre"] },
      ],
      limit,
      offset,
    });

    // Se generan URLs firmadas dinamicamente para cada producto
    const productosConURLs = await Promise.all(
      productos.map(async (producto) => {
        const urlFirmada = await generarURLFirmada(
          producto.imagen.split("/").pop(),
          "r"
        );
        return {
          ...productoSerializer(producto),
          imagen: urlFirmada || producto.imagen,
        };
      })
    );

    // Se serializan los productos y se estructura la respuesta
    res.json({
      data: productosConURLs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error en obtenerProductos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
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
