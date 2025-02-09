const express = require("express");
const {
  createDireccion,
  getAllDirecciones,
  getDireccionById,
  updateDireccion,
  deleteDireccion,
} = require("../views/direccionController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

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