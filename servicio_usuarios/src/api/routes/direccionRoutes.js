const express = require("express");
const router = express.Router();
const { obtenerDireccionPorId } = require("../views/direccionController");

router.get("/direcciones/:id", obtenerDireccionPorId);

module.exports = router;
