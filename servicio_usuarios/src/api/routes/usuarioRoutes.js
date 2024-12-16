const express = require("express");
const {
  getAllUsuariosController,
  getUsuarioController,
  deleteUsuarioController,
  updateUsuarioController,
} = require("../views/viewsController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                   email:
 *                     type: string
 *       403:
 *         description: Acceso denegado
 */
router.get(
  "/usuarios",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  getAllUsuariosController
); // Obtener todos los usuarios
/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  "/usuario/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  getUsuarioController
); // Obtener un usuario por ID
router.delete(
  "/usuario/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  deleteUsuarioController
); // Eliminar un usuario por ID
router.post(
  "/usuario/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  updateUsuarioController
); // Actualizar un usuario por ID

module.exports = router;
