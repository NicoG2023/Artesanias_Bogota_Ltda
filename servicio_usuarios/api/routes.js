const express = require("express");
const { getAllUsuarios, getUsuario, deleteUsuario } = require("./views");
const router = express.Router();

router.get('/', getAllUsuarios)
router.get('/:id',getUsuario)
router.delete('/:id', deleteUsuario)

module.exports = router;