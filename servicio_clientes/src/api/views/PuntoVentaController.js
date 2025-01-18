const { PuntoVenta } = require("../../models");

const obtenerPuntosDeVenta = async (req, res) => {
  try {
    const puntosVenta = await PuntoVenta.findAll();
    return res.status(200).json(puntosVenta);
  } catch (error) {
    console.error("Error al obtener los puntos de venta:", error);
    return res.status(500).json({
      message: "Error al obtener los puntos de venta",
      error: error.message || error,
    });
  }
};

module.exports = {
  obtenerPuntosDeVenta,
};
