const express = require("express");
const { getAllUsuariosController, getUsuarioController, deleteUsuarioController } = require("./viewsController");
const router = express.Router();

router.get('/usuarios', getAllUsuariosController); // Obtener todos los usuarios
router.get('/usuario/:id', getUsuarioController); // Obtener un usuario por ID
router.delete('/usuario/:id', deleteUsuarioController); // Eliminar un usuario por ID

module.exports = router;