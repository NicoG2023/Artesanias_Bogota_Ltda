const express = require("express");
const router = express.Router();
const { 
    obtenerInventario,
    agregarProductoInventario,
    actualizarStock,
    eliminarProductoInventario,
    revisarStock,
} = require("../views/inventarioController");

// Obtener todos los productos en el inventario
/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Obtiene todos los productos en el inventario
 *     description: Retorna todos los productos disponibles en el inventario con su cantidad y ubicación.
 *     responses:
 *       200:
 *         description: Lista de productos en el inventario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *                     format: float
 *                   cantidad:
 *                     type: integer
 *                   ubicacion:
 *                     type: string
 *       500:
 *         description: Error al obtener el inventario
 */
router.get("/inventario", obtenerInventario);

// Agregar un nuevo producto al inventario
/**
 * @swagger
 * /inventario:
 *   post:
 *     summary: Agrega un nuevo producto al inventario
 *     description: Permite agregar un nuevo producto con su cantidad inicial al inventario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: integer
 *               cantidadInicial:
 *                 type: integer
 *               ubicacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto agregado exitosamente al inventario
 *       400:
 *         description: Error de validación (producto no encontrado)
 *       500:
 *         description: Error al agregar el producto
 */
router.post("/inventario", agregarProductoInventario);

// Actualizar la cantidad de un producto en el inventario
/**
 * @swagger
 * /inventario/{inventarioId}:
 *   put:
 *     summary: Actualiza la cantidad de un producto en el inventario
 *     description: Permite actualizar la cantidad de un producto existente en el inventario, ya sea por venta o reabastecimiento.
 *     parameters:
 *       - name: inventarioId
 *         in: path
 *         description: ID del registro en el inventario
 *         required: true
 *         schema:
 *           type: integer
 *       - name: cantidad
 *         in: body
 *         required: true
 *         description: Nueva cantidad del producto
 *         schema:
 *           type: object
 *           properties:
 *             cantidad:
 *               type: integer
 *             operacion:
 *               type: string
 *               enum:
 *                 - venta
 *                 - reabastecimiento
 *     responses:
 *       200:
 *         description: Cantidad actualizada con éxito
 *       400:
 *         description: Stock insuficiente para la venta o operación inválida
 *       404:
 *         description: Registro de inventario no encontrado
 *       500:
 *         description: Error al actualizar la cantidad
 */
router.put("/:inventarioId", actualizarStock);

// Eliminar un producto del inventario
/**
 * @swagger
 * /inventario/{inventarioId}:
 *   delete:
 *     summary: Elimina un producto del inventario
 *     description: Permite eliminar un producto del inventario.
 *     parameters:
 *       - name: inventarioId
 *         in: path
 *         description: ID del registro en el inventario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado del inventario
 *       404:
 *         description: Registro de inventario no encontrado
 *       500:
 *         description: Error al eliminar el producto
 */
router.delete("/:inventarioId", eliminarProductoInventario);

// Revisar el stock de un producto
/**
 * @swagger
 * /inventario/stock/{productoId}:
 *   get:
 *     summary: Revisa el stock de un producto específico
 *     description: Permite obtener el stock total de un producto específico en todas las ubicaciones.
 *     parameters:
 *       - name: productoId
 *         in: path
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock disponible por ubicación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ubicacion:
 *                     type: string
 *                   cantidad:
 *                     type: integer
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al revisar el stock
 */
router.get("/stock/:productoId", revisarStock);

module.exports = router;