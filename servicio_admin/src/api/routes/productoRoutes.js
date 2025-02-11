const express = require("express");
const {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  desactivarProducto,
  agregarProductosBulk,
  obtenerProductosCarousel,
} = require("../views/productoController");
const { obtenerFiltros } = require("../views/categoriaController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints para gestionar productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener una lista de productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Artesanía
 *         description: Búsqueda por nombre del producto
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: integer
 *           example: 2
 *         description: ID de la categoría para filtrar productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       precio:
 *                         type: number
 *                         format: float
 *                       descripcion:
 *                         type: string
 *                       es_activo:
 *                         type: boolean
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Error al obtener los productos
 */
router.get("/productos", obtenerProductos);

router.get("/productos/carousel", obtenerProductosCarousel);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Artesanía de madera
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 25.50
 *               descripcion:
 *                 type: string
 *                 example: Artesanía hecha a mano con madera reciclada
 *               es_activo:
 *                 type: boolean
 *                 example: true
 *               categoria_fk:
 *                 type: integer
 *                 example: 1
 *               color:
 *                 type: string
 *                 example: Marrón
 *               talla:
 *                 type: string
 *                 example: M
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error al crear el producto
 */
router.post("/productos", agregarProducto);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Editar un producto existente
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto a editar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Artesanía renovada
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 30.00
 *               descripcion:
 *                 type: string
 *                 example: Descripción actualizada del producto
 *               es_activo:
 *                 type: boolean
 *                 example: true
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               color:
 *                 type: string
 *                 example: Azul
 *               talla:
 *                 type: string
 *                 example: L
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del producto
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al editar el producto
 */
router.put("/productos/:id", editarProducto);

/**
 * @swagger
 * /productos/{id}/desactivar:
 *   put:
 *     summary: Desactivar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto a desactivar
 *     responses:
 *       200:
 *         description: Producto desactivado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al desactivar el producto
 */
router.put("/productos/:id/desactivar", desactivarProducto);

/**
 * @swagger
 * /productos/filtros:
 *   get:
 *     summary: Obtener nombres de las categorías y colores únicos de los productos
 *     tags: [Categorías y Colores]
 *     responses:
 *       200:
 *         description: Lista de nombres de categorías y colores únicos de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categorias:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de nombres de categorías
 *                 colores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de colores únicos de productos
 *       500:
 *         description: Error al obtener categorías y colores únicos
 */
router.get("/productos/filtros", obtenerFiltros);

router.post(
  "/productos/bulk",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  agregarProductosBulk
);

router.get("/productos/plantilla", (req, res) => {
  // Cabeceras para forzar la descarga
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="plantilla_producto.json"'
  );
  res.setHeader("Content-Type", "application/json");

  // Plantilla de ejemplo, con un solo producto o incluso varios
  const plantilla = {
    productos: [
      {
        nombre: "Ejemplo de producto",
        precio: "50.000",
        descripcion: "Descripción",
        es_activo: true,
        color: "Azul",
        talla: "M",
        imagenBase64: null,
        rating: 4.5,
        categorias: [1, 2], // IDs de categorías
        inventarios: [
          // Ahora es un arreglo
          {
            punto_venta_fk: 2,
            nombre_punto_venta: "Punto Físico Chapinero",
            cantidad: 10,
          },
          {
            punto_venta_fk: 3,
            nombre_punto_venta: "Punto Físico Centro",
            cantidad: 5,
          },
        ],
      },
    ],
  };

  // Responder con el JSON
  res.status(200).json(plantilla);
});

module.exports = router;
