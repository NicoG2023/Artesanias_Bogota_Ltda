const express = require("express");
const router = express.Router();
const { getEmpleadosConMasVentas } = require("../views/AnaliticaController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/analiticas/empleados-con-mas-ventas",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff"),
  getEmpleadosConMasVentas
);

module.exports = router;
