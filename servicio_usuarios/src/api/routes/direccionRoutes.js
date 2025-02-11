const express = require("express");
const router = express.Router();

module.exports = router;
const {
  createDireccion,
  getAllDirecciones,
  getDireccionById,
  updateDireccion,
  deleteDireccion,
  obtenerDireccionPorId,
} = require("../views/direccionController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

router.get("/direcciones/:id", obtenerDireccionPorId);

router.put(
  "/perfil/direccion/create-direccion",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff", "cliente"),
  createDireccion
);

router.get(
  "/perfil/direccion/obtener-direcciones",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff", "cliente"),
  getAllDirecciones
);

router.get(
  "/perfil/direccion/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff", "cliente"),
  getDireccionById
);

router.put(
  "/perfil/direccion/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff", "cliente"),
  updateDireccion
);

router.delete(
  "/perfil/direccion/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff", "cliente"),
  deleteDireccion
);

module.exports = router;
