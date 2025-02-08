const express = require("express");
const {
    updateNombreApellido,
    updateEmail,
    updateContrasena,
} = require("../views/perfilController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /perfil/update-nombre-apellido:
 *   put:
 *     summary: Actualiza el nombre y/o apellido del usuario
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Perfil
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
 *     responses:
 *       200:
 *         description: Nombre y/o apellido actualizados correctamente
 *       400:
 *         description: Debe proporcionar al menos un campo válido
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    "/perfil/update-nombre-apellido",
    verifyToken,
    authorizeRoles("admin", "superadmin","staff","cliente"),
    updateNombreApellido
);

/**
 * @swagger
 * /perfil/update-email:
 *   put:
 *     summary: Actualiza el correo electrónico del usuario
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevoEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Correo electrónico actualizado correctamente
 *       400:
 *         description: Formato de correo no válido o ya en uso
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    "/perfil/update-email",
    verifyToken,
    authorizeRoles("admin", "superadmin","staff","cliente"),
    updateEmail
);

/**
 * @swagger
 * /perfil/update-password:
 *   put:
 *     summary: Actualiza la contraseña del usuario
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevaContrasena:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: La contraseña no cumple con los requisitos
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    "/perfil/update-password",
    verifyToken,
    authorizeRoles("admin", "superadmin","staff","cliente"),
    updateContrasena
);

module.exports = router;
