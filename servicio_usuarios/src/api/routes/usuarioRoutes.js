const express = require("express");
const {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  deleteUsuario,
  updateUsuario,
} = require("../views/views");
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
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
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
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               puntos_descuento:
 *                 type: integer
 *               rol:
 *                 type: string
 *               es_activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 email:
 *                   type: string
 *                 puntos_descuento:
 *                   type: integer
 *                 rol:
 *                   type: string
 *       400:
 *         description: Error en la creación del usuario
 *       403:
 *         description: Acceso denegado
 */
router.post(
  "/usuarios",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  createUsuario
); // Crear un usuario

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
 */
router.get(
  "/usuarios",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  getAllUsuarios
);

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
 */
router.get(
  "/usuario/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  getUsuarioById
);

/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 */
router.put(
  "/usuario/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  updateUsuario
);

/**
 * @swagger
 * /usuario/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 */
router.delete(
  "/usuario/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  deleteUsuario
);

module.exports = router;
