const {
  Orden,
  Pago,
  PuntoVenta,
  REL_Orden_Producto,
  sequelize,
} = require("../../models");

//Controlador para crear Orden
const crearOrden = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      usuraio_fk,
      lugar_compra_fk,
      estado,
      pago_fk,
      total,
      productos = [],
    } = req.body;

    const nuevaOrden = await Orden.create(
      {
        usuraio_fk,
        lugar_compra_fk,
        estado,
        pago_fk,
        total,
        fecha_orden: new Date(),
      },
      { transaction: t }
    );
    if (productos.lenth > 0) {
      const rels = productos.map((prod) => ({
        orden_fk: nuevaOrden.id,
        producto_fk: prod.producto_fk,
        cantidad: prod.cantidad,
      }));
      await REL_Orden_Producto.bulkCreate(rels, { transaction: t });
    }
    await t.commit();

    return res.status(201).json({
      message: "Orden creada exitosamente",
      data: nuevaOrden,
    });
  } catch (error) {
    await t.rollback(); // Revertir la transacción en caso de error
    console.error("Error al crear la orden:", error);
    return res.status(500).json({
      message: "Error al crear la orden",
      error: error.message || error,
    });
  }
};

// Obtener todas las ordenes (sin importar el usuario)
const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        { model: Pago, as: "pago" },
        { model: PuntoVenta, as: "puntoVenta" },
        { model: REL_Orden_Producto, as: "productosOrden" },
      ],
    });

    return res.json({
      message: "Lista de ordenes",
      data: ordenes,
    });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return res.status(500).json({
      message: "Error al obtener las órdenes",
      error: error.message || error,
    });
  }
};

//Obtener orden por ID
const obtenerOrdenPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const orden = await Orden.findByPk(id, {
      include: [
        { model: Pago, as: "pago" },
        { model: PuntoVenta, as: "puntoVenta" },
        { model: REL_Orden_Producto, as: "productosOrden" },
      ],
    });

    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.json({
      message: "Orden encontrada",
      data: orden,
    });
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return res.status(500).json({
      message: "Error al obtener la orden",
      error: error.message || error,
    });
  }
};

// Editar el estado de una orden
const updateEstadoOrden = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const orden = await Orden.findByPk(id);
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    orden.estado = estado;
    await orden.save();

    return res.json({
      message: "Estado de la orden actualizado correctamente",
      data: orden,
    });
  } catch (error) {
    console.error("Error al actualizar estado de la orden:", error);
    return res.status(500).json({
      message: "Error al actualizar estado de la orden",
      error: error.message || error,
    });
  }
};

//Obtener ordenes por usuario
const obtenerOrdenesPorUsuario = async (req, res) => {
  const { usuario_fk } = req.params;
  try {
    const ordenesUsuario = await Orden.findAll({
      where: { usuraio_fk: usuario_fk },
      include: [
        { model: Pago, as: "pago" },
        { model: PuntoVenta, as: "puntoVenta" },
        { model: REL_Orden_Producto, as: "productosOrden" },
      ],
    });

    return res.json({
      message: `Lista de ordenes del usuario ${usuario_fk}`,
      data: ordenesUsuario,
    });
  } catch (error) {
    console.error("Error al obtener las órdenes por usuario:", error);
    return res.status(500).json({
      message: "Error al obtener las órdenes por usuario",
      error: error.message || error,
    });
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  updateEstadoOrden,
  obtenerOrdenesPorUsuario,
};
