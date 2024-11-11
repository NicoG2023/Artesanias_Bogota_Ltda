const { Producto, Categoria } = require('../../models');
const productoSerializer = require('../serializers/productoSerializer');
const { containerClient } = require('../../config/blob-storage');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

//Vista para obtener productos con paginación y filtrado
const obtenerProductos = async (req, res) => {
  try {
    const { page = 1, search = '', categoria = null } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    //Condiciones de búsqueda y filtrado
    const where = {
      ...(search && { nombre: { [Op.like]: `%${search}%` } }),
      ...(categoria && { categoria_fk: categoria }),
    };

    // Se realiza la búsqueda con paginación y las relaciones necesarias
    const { rows: productos, count: total } = await Producto.findAndCountAll({
      where,
      includ: [{ model: Categoria, attributes: ['id', 'nombre'] }],
      limit,
      offset,
    });

    // Se serializan los productos y se estructura la respuesta
    const serializedProductos = productos.map(productoSerializer);
    res.json({
      data: serializedProductos,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

//Configuración de multer para recibir archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext === '.jpg' ||
      ext === '.jpeg' ||
      ext === '.png' ||
      ext === '.webp'
    ) {
      cb(null, true);
    } else {
      cb(
        new Error('Solo se permiten imágenes en formato JPG, JPEG, PNG o WEBP'),
      );
    }
  },
}).single('imagen'); //el campo en el formulario debe llamarse "imagen"

//Vista para crear un nuevo producto
const agregarProducto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error en multer:', err.message);
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
      let imagenUrl;

      if (req.file) {
        // Subida de la imagen a Azure Blob Storage
        const blobName = `${uuidv4()}${path.extname(req.file.originalname)}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        imagenUrl = blockBlobClient.url; //URL de la imagen a guardar en la BD
      } else {
        imagenUrl =
          'https://artesaniasbogota2024.blob.core.windows.net/imagenes-artesanias/default-product.webp'; //Imagen por defecto en caso de que no se agregue una.
      }

      //Guardar el producto en la BD
      const nuevoProducto = await Producto.create({
        nombre,
        precio,
        descripcion,
        imagen: imagenUrl,
        es_activo,
        categoria_fk,
        color,
        talla,
      });

      res.status(201).json(productoSerializer(nuevoProducto));
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      res
        .status(500)
        .json({
          error: 'Error al agregar el producto',
          details: error.message,
        });
    }
  });
};

// Vista para editar un producto *existente*
const editarProducto = async (req, res) => {
  const { id } = req.params;

  // Subida de imagen, si existe, y actualización de datos
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
      // Buscar el producto
      const producto = await Producto.findByPk(id);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Subir una nueva imagen a Azure Blob Storage si se proporciona una
      let imagenUrl = producto.imagen;
      if (req.file) {
        const blobName = `${uuidv4()}${path.extname(req.file.originalname)}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        imagenUrl = blockBlobClient.url; //URL de la nueva imagen
      }

      //Actualizar los datos del producto
      await producto.update({
        nombre,
        precio,
        descripcion,
        imagen: imagenUrl,
        es_activo,
        categoria_fk,
        color,
        talla,
      });
      res.status(200).json(productoSerializer(producto));
    } catch (error) {
      res.status(500).json({ error: 'Error al editar el producto' });
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
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    //Actualizar el campo "es_activo" a false
    await producto.update({ es_activo: false });

    res.status(200).json({
      message: 'Producto desactivado exitosamente',
      data: productoSerializer(producto),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar el producto' });
  }
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  desactivarProducto,
};
