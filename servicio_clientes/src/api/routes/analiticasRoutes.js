const express = require("express");
const router = express.Router();
const {
  getEmpleadosConMasVentas,
  getEmpleadosConMasDineroGenerado,
} = require("../views/AnaliticaController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/analiticas/empleados-con-mas-ventas",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff"),
  getEmpleadosConMasVentas
);

router.get(
  "/analiticas/empleados-con-mas-dinero-generado",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff"),
  getEmpleadosConMasDineroGenerado
);

module.exports = router;
