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

module.exports = { obtenerDireccionPorId };
