const express = require('express');
const {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  desactivarProducto,
} = require('../views/productoController');

const router = express.Router();

router.get('/productos', obtenerProductos);
router.post('/productos', agregarProducto);
router.put('/productos/:id', editarProducto);
router.put('/productos/:id/desactivar', desactivarProducto);

module.exports = router;
