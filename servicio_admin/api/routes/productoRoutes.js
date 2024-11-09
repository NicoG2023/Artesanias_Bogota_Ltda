const express = require("express");
const {
  obtenerProductos,
  agregarProducto,
} = require("../views/productoController");

const router = express.Router();

router.get("/productos", obtenerProductos);
router.post("/productos", agregarProducto);

module.exports = router;
