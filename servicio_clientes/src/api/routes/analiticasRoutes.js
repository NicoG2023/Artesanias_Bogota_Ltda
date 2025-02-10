const express = require("express");
const router = express.Router();
const {
  getEmpleadosConMasVentas,
  getEmpleadosConMasDineroGenerado,
  getProductosMasVendidos,
  getClientesConMasCompras
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

router.get(
  "/analiticas/productos-mas-vendidos",
  verifyToken,
  authorizeRoles("admin", "superadmin", "staff"),
  getProductosMasVendidos
)

router.get(
  "/analiticas/clientes-con-mas-compras",
  verifyToken,  
  authorizeRoles("admin", "superadmin", "staff"),
  getClientesConMasCompras
)

module.exports = router;
