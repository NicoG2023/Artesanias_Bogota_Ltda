const Direccion = require("../../models/Direccion");

const obtenerDireccionPorId = async (req, res) => {
  console.log("req.params en obtenerDireccionPorId:", req.params);
  const { id } = req.params;
  const { usuario_id } = req.params;

  try {
    const direccion = await Direccion.findByPk(id);
    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }
    // Verificar que la dirección pertenezca al usuario autenticado
    if (usuario_id && direccion.usuario_fk !== usuario_id) {
      return res
        .status(403)
        .json({ message: "Acceso no autorizado a esta dirección" });
    }
    return res.status(200).json({ direccion });
  } catch (error) {
    console.error("Error al obtener la dirección:", error);
    return res.status(500).json({
      message: "Error al obtener la dirección",
      error: error.message || error,
    });
  }
};

// Crear una dirección
const createDireccion = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      direccion,
      ciudad,
      departamento,
      codigo_postal,
      pais,
      info_adicional,
    } = req.body;

    if (!direccion || !ciudad || !departamento) {
      return res
        .status(400)
        .json({
          message:
            "Faltan campos obligatorios (dirección, ciudad, departamento)",
        });
    }

    const nuevaDireccion = await Direccion.create({
      usuario_fk: userId,
      direccion,
      ciudad,
      departamento,
      codigo_postal,
      pais: pais || "Colombia",
      info_adicional,
    });

    res.status(201).json(nuevaDireccion);
  } catch (error) {
    console.error("Error al crear la dirección:", error);
    res.status(500).json({ message: "Error al crear la dirección" });
  }
};

// Obtener todas las direcciones de un usuario
const getAllDirecciones = async (req, res) => {
  try {
    const { userId } = req.user;

    const direcciones = await Direccion.findAll({
      where: { usuario_fk: userId },
    });

    res.status(200).json(direcciones);
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    res.status(500).json({ message: "Error al obtener las direcciones" });
  }
};

// Obtener una dirección específica por ID
const getDireccionById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const direccion = await Direccion.findOne({
      where: { id, usuario_fk: userId },
    });

    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    res.status(200).json(direccion);
  } catch (error) {
    console.error("Error al obtener la dirección:", error);
    res.status(500).json({ message: "Error al obtener la dirección" });
  }
};

// Actualizar una dirección
const updateDireccion = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const {
      direccion,
      ciudad,
      departamento,
      codigo_postal,
      pais,
      info_adicional,
    } = req.body;

    const direccionExistente = await Direccion.findOne({
      where: { id, usuario_fk: userId },
    });

    if (!direccionExistente) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    await direccionExistente.update({
      direccion,
      ciudad,
      departamento,
      codigo_postal,
      pais,
      info_adicional,
    });

    res.status(200).json({ message: "Dirección actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la dirección:", error);
    res.status(500).json({ message: "Error al actualizar la dirección" });
  }
};

// Eliminar una dirección
const deleteDireccion = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const direccion = await Direccion.findOne({
      where: { id, usuario_fk: userId },
    });

    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    await direccion.destroy();

    res.status(200).json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la dirección:", error);
    res.status(500).json({ message: "Error al eliminar la dirección" });
  }
};

module.exports = {
  createDireccion,
  getAllDirecciones,
  getDireccionById,
  updateDireccion,
  deleteDireccion,
  obtenerDireccionPorId,
};
