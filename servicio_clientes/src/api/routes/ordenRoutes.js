/**
 * @swagger
 * tags:
 *   name: Ordenes
 *   description: API para la gestión de órdenes
 */

const express = require("express");
const router = express.Router();
const {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  obtenerOrdenesPorUsuario,
  updateEstadoOrden,
} = require("../views/OrdenController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

/**
 * @swagger
 * /api/ordenes:
 *   post:
 *     summary: Crea una nueva orden
 *     tags: [Ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuraio_fk:
 *                 type: integer
 *               lugar_compra_fk:
 *                 type: integer
 *               estado:
 *                 type: string
 *               pago_fk:
 *                 type: integer
 *               total:
 *                 type: number
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_fk:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *             example:
 *               usuraio_fk: 1
 *               lugar_compra_fk: 2
 *               estado: "pendiente"
 *               pago_fk: 5
 *               total: 100.0
 *               productos:
 *                 - producto_fk: 101
 *                   cantidad: 2
 *                 - producto_fk: 202
 *                   cantidad: 1
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       500:
 *         description: Error al crear la orden
 */
router.post("/", verifyToken, authorizeRoles("cliente"), crearOrden);

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Obtiene todas las órdenes
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *       500:
 *         description: Error al obtener las órdenes
 */
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  obtenerOrdenes
);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   get:
 *     summary: Obtiene una orden por ID
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error al obtener la orden
 */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  obtenerOrdenPorId
);

/**
 * @swagger
 * /api/ordenes/usuario/{usuario_fk}:
 *   get:
 *     summary: Obtiene las órdenes de un usuario específico
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: usuario_fk
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *       500:
 *         description: Error al obtener las órdenes por usuario
 */
router.get(
  "/usuario/:usuario_fk",
  verifyToken,
  authorizeRoles("cliente", "admin", "superadmin"),
  obtenerOrdenesPorUsuario
);

/**
 * @swagger
 * /api/ordenes/{id}/estado:
 *   put:
 *     summary: Actualiza el estado de una orden
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *             example:
 *               estado: "pagado"
 *     responses:
 *       200:
 *         description: Estado de la orden actualizado correctamente
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error al actualizar estado de la orden
 */
router.put(
  "/:id/estado",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  updateEstadoOrden
);

module.exports = router;
