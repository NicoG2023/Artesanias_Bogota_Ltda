const express = require("express");
const router = express.Router();
const {
  crearPuntoDeVenta,
  obtenerPuntosDeVenta,
  obtenerPuntoDeVentaPorId,
  obtenerPuntosDeVentaPages,
  actualizarPuntoDeVenta,
  eliminarPuntoDeVenta,
} = require("../views/PuntoVentaController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Puntos de Venta
 *   description: API para la gestión de puntos de venta
 */

/**
 * @swagger
 * /puntos-venta:
 *   post:
 *     summary: Crear un nuevo punto de venta
 *     tags: [Puntos de Venta]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del punto de venta
 *               tipo:
 *                 type: string
 *                 enum: [fisico, online]
 *                 description: Tipo del punto de venta
 *               direccion:
 *                 type: string
 *                 description: Dirección del punto de venta (opcional)
 *     responses:
 *       201:
 *         description: Punto de venta creado exitosamente
 *       400:
 *         description: Datos faltantes o inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/puntos-venta",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  crearPuntoDeVenta
); // Crear un punto de venta

/**
 * @swagger
 * /puntos-venta:
 *   get:
 *     summary: Obtener todos los puntos de venta
 *     tags: [Puntos de Venta]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de puntos de venta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PuntoVenta'
 *       500:
 *         description: Error al obtener los puntos de venta
 */
router.get("/puntos-venta", obtenerPuntosDeVenta); // Obtener puntos de venta

/**
 * @swagger
 * /puntos-venta/{id}:
 *   get:
 *     summary: Obtener un punto de venta por ID
 *     tags: [Puntos de Venta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del punto de venta
 *     responses:
 *       200:
 *         description: Punto de venta obtenido exitosamente
 *       404:
 *         description: Punto de venta no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/puntos-venta/:id",
  verifyToken,
  authorizeRoles("staff", "admin", "superadmin"),
  obtenerPuntoDeVentaPorId
); // Obtener un punto de venta por ID

/**
 * @swagger
 * /puntos-venta-page:
 *   get:
 *     summary: Obtener puntos de venta con paginación
 *     tags: [Puntos de Venta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *         description: Página a consultar (por defecto 1)
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Número de resultados por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Puntos de venta paginados obtenidos exitosamente
 *       400:
 *         description: Error en la paginación
 */
router.get(
  "/puntos-venta-page",
  verifyToken,
  authorizeRoles("staff", "admin", "superadmin"),
  obtenerPuntosDeVentaPages
); // Obtener puntos de venta paginados

/**
 * @swagger
 * /puntos-venta/{id}:
 *   put:
 *     summary: Actualizar un punto de venta
 *     tags: [Puntos de Venta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del punto de venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [fisico, online]
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Punto de venta actualizado exitosamente
 *       404:
 *         description: Punto de venta no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  "/puntos-venta/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  actualizarPuntoDeVenta
); // Actualizar puntos de venta

/**
 * @swagger
 * /puntos-venta/{id}:
 *   delete:
 *     summary: Eliminar un punto de venta
 *     tags: [Puntos de Venta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del punto de venta
 *     responses:
 *       200:
 *         description: Punto de venta eliminado exitosamente
 *       404:
 *         description: Punto de venta no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  "/puntos-venta/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  eliminarPuntoDeVenta
); // Delete puntos de venta

module.exports = router;
