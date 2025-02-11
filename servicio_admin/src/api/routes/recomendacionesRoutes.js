const express = require("express");
const router = express.Router();
const {
  getRecomendacionProductos,
} = require("../views/sistemaRecomendacionController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/recomendaciones/:userId",
  verifyToken,
  authorizeRoles("cliente"),
  getRecomendacionProductos
);

module.exports = router;
