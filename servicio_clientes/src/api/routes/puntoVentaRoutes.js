/**
 * @swagger
 * tags:
 *   name: Puntos de Venta
 *   description: API para la gestión de puntos de venta
 */

const express = require("express");
const router = express.Router();
const { obtenerPuntosDeVenta } = require("../views/PuntoVentaController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/puntos-venta",
  verifyToken,
  authorizeRoles("staff", "admin", "superadmin"),
  obtenerPuntosDeVenta
);

module.exports = router;
