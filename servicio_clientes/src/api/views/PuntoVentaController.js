const { PuntoVenta } = require("../../models");

// Crear un nuevo punto de venta
const crearPuntoDeVenta = async (req, res) => {
  try {
    const { nombre, tipo, direccion } = req.body;

    // Validar campos obligatorios
    if (!nombre || !tipo) {
      return res
        .status(400)
        .json({ message: "Faltan campos obligatorios (nombre, tipo)" });
    }

    // Validar tipo
    if (!["fisico", "online"].includes(tipo)) {
      return res
        .status(400)
        .json({ message: "El tipo debe ser 'fisico' u 'online'" });
    }

    // Crear el punto de venta
    const nuevoPuntoVenta = await PuntoVenta.create({
      nombre,
      tipo,
      direccion,
    });
    res.status(201).json(nuevoPuntoVenta);
  } catch (error) {
    console.error("Error al crear el punto de venta:", error);
    res
      .status(500)
      .json({
        message: "Error al crear el punto de venta",
        error: error.message || error,
      });
  }
};

// Obtener todos los puntos de venta
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

// Obtener un punto de venta por ID
const obtenerPuntoDeVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const puntoVenta = await PuntoVenta.findByPk(id);
    if (!puntoVenta) {
      return res.status(404).json({ message: "Punto de venta no encontrado" });
    }
    res.status(200).json(puntoVenta);
  } catch (error) {
    console.error("Error al obtener el punto de venta:", error);
    res
      .status(500)
      .json({
        message: "Error al obtener el punto de venta",
        error: error.message || error,
      });
  }
};

// Obtener puntos de venta por páginas
const obtenerPuntosDeVentaPages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Leer parámetros de paginación
    const offset = (page - 1) * limit; // Calcular el inicio de los registros

    // Consultar puntos de venta con paginación y orden por ID descendente
    const { count, rows: puntosVenta } = await PuntoVenta.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["id", "ASC"]], // Ordenar por ID en orden descendente
    });

    // Responder con los puntos de venta paginados y el total de registros
    res.status(200).json({
      puntosVenta,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al obtener los puntos de venta:", error);
    res
      .status(400)
      .json({
        message: "Error al obtener los puntos de venta: " + error.message,
      });
  }
};

// Actualizar un punto de venta
const actualizarPuntoDeVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, direccion } = req.body;

    const puntoVenta = await PuntoVenta.findByPk(id);
    if (!puntoVenta) {
      return res.status(404).json({ message: "Punto de venta no encontrado" });
    }

    // Validar tipo si se incluye en la actualización
    if (tipo && !["fisico", "online"].includes(tipo)) {
      return res
        .status(400)
        .json({ message: "El tipo debe ser 'fisico' o 'online'" });
    }

    // Actualizar el punto de venta
    await puntoVenta.update({ nombre, tipo, direccion });
    res.status(200).json(puntoVenta);
  } catch (error) {
    console.error("Error al actualizar el punto de venta:", error);
    res
      .status(500)
      .json({
        message: "Error al actualizar el punto de venta",
        error: error.message || error,
      });
  }
};

// Eliminar un punto de venta
const eliminarPuntoDeVenta = async (req, res) => {
  try {
    const { id } = req.params;

    const puntoVenta = await PuntoVenta.findByPk(id);
    if (!puntoVenta) {
      return res.status(404).json({ message: "Punto de venta no encontrado" });
    }

    // Eliminar el punto de venta
    await puntoVenta.destroy();
    res.status(200).json({ message: "Punto de venta eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el punto de venta:", error);
    res
      .status(500)
      .json({
        message: "Error al eliminar el punto de venta",
        error: error.message || error,
      });
  }
};

module.exports = {
  crearPuntoDeVenta,
  obtenerPuntosDeVenta,
  obtenerPuntoDeVentaPorId,
  obtenerPuntosDeVentaPages,
  actualizarPuntoDeVenta,
  eliminarPuntoDeVenta,
};
