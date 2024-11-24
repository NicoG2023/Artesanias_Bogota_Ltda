const express = require("express");
const {
  getAllUsuariosController,
  getUsuarioController,
  deleteUsuarioController,
  updateUsuarioController,
} = require("../views/viewsController");
const verifyToken = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/auth/authorizeRoles");
const router = express.Router();

router.get(
  "/usuarios",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  getAllUsuariosController
); // Obtener todos los usuarios
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
