const express = require("express");
const {
  login,
  register,
  getMe,
  verifyUser,
  verify2fa,
  solicitarResetPassword,
  resetPassword,
} = require("../views/authController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email del usuario
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     rol:
 *                       type: string
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */

router.post("/auth/login", login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Email ya registrado
 *       500:
 *         description: Error en el servidor
 */
router.post("/auth/register", register);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado obtenidos exitosamente
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
 *                   example: cliente
 *       401:
 *         description: Token inválido o expirado
 *       403:
 *         description: Token requerido
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/auth/me", verifyToken, getMe);

router.get("/auth/verify", verifyUser);

router.post("/auth/verify2fa", verify2fa);

router.post("/auth/solicitar-reset-password", solicitarResetPassword);

router.post("/auth/reset-password", resetPassword);

module.exports = router;
