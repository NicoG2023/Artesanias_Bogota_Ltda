const express = require("express");
const {
  obtenerCarrito,
  agregarProductoACarrito,
  editarCantidadProducto,
  eliminarProductoDeCarrito,
} = require("../views/carritoController");
const { verifyToken } = require("../../../../servicio_usuarios/src/middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Endpoints para gestionar el carrito de compras
 */

/**
 * @swagger
 * /carrito/{usuarioId}:
 *   get:
 *     summary: Obtener el carrito de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 usuario_fk:
 *                   type: integer
 *                 productos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productoId:
 *                         type: integer
 *                       cantidad:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       precio:
 *                         type: number
 *                         format: float
 *                       imagen:
 *                         type: string
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error al obtener el carrito
 */
router.get("/carrito/:usuarioId", verifyToken, obtenerCarrito);

/**
 * @swagger
 * /carrito:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               productoId:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto agregado al carrito exitosamente
 *       400:
 *         description: Error en la validación de los datos
 *       500:
 *         description: Error al agregar el producto al carrito
 */
router.post("/carrito", verifyToken, agregarProductoACarrito);

/**
 * @swagger
 * /carrito/{usuarioId}/producto/{productoId}:
 *   put:
 *     summary: Editar la cantidad de un producto en el carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *       - in: path
 *         name: productoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 description: Nueva cantidad del producto
 *     responses:
 *       200:
 *         description: Cantidad del producto actualizada exitosamente
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error al editar la cantidad del producto
 */
router.put("/carrito/:usuarioId/producto/:productoId", verifyToken, editarCantidadProducto);

/**
 * @swagger
 * /carrito/{usuarioId}/producto/{productoId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *       - in: path
 *         name: productoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito exitosamente
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error al eliminar el producto del carrito
 */
router.delete("/carrito/:usuarioId/producto/:productoId", verifyToken, eliminarProductoDeCarrito);

module.exports = router;
