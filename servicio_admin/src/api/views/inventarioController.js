const { Inventario, Producto } = require("../../models");

// Obtener el inventario
const obtenerInventario = async (req, res) => {
  try {
    // Obtener todos los productos en el inventario con su cantidad actual
    const inventario = await Inventario.findAll({
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "nombre", "precio"],
        },
      ],
    });

    return res.status(200).json(inventario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el inventario" });
  }
};

// Agregar un producto al inventario
const agregarProductoInventario = async (req, res) => {
  const { productoId, cantidadInicial, ubicacion } = req.body;

  try {
    // Verificar si el producto existe
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar/crear el inventario para este producto y ubicación
    const [inventario, created] = await Inventario.findOrCreate({
      where: { producto_fk: productoId, ubicacion },
      defaults: {
        cantidad: cantidadInicial || 0,
      },
    });

    if (!created) {
      return res.status(409).json({ message: "El producto ya existe en el inventario para esta ubicación" });
    }

    return res.status(201).json({ message: "Producto agregado al inventario", inventario });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al agregar producto al inventario" });
  }
};

// Actualizar la cantidad de un producto (ventas o reabastecimiento)
const actualizarStock = async (req, res) => {
  const { sku } = req.params;
  const { cantidad, operacion, punto_venta_fk, nombre_punto_venta } = req.body;

  if (!["venta", "reabastecimiento"].includes(operacion)) {
    return res.status(400).json({ mensaje: "Operación inválida" });
  }

  try {
    // Buscar el producto por SKU
    const producto = await Producto.findOne({ where: { sku } });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Buscar el inventario en el punto de venta
    const inventario = await Inventario.findOne({
      where: {
        producto_fk: producto.id,
        punto_venta_fk: punto_venta_fk,
      },
    });

    if (!inventario) {
      return res.status(404).json({ mensaje: "Inventario no encontrado para este punto de venta" });
    }

    // Realizar la operación (venta o reabastecimiento)
    if (operacion === "venta") {
      if (inventario.cantidad < cantidad) {
        return res
          .status(400)
          .json({ mensaje: "Stock insuficiente para realizar la venta" });
      }
      inventario.cantidad -= cantidad;
    } else if (operacion === "reabastecimiento") {
      inventario.cantidad += cantidad;
    }

    // Actualizar el nombre del punto de venta en caso de que se haya cambiado
    if (nombre_punto_venta) {
      inventario.nombre_punto_venta = nombre_punto_venta;
    }

    // Guardar los cambios en el inventario
    await inventario.save();

    return res.status(200).json({
        mensaje: `Operación ${operacion} realizada con éxito en el punto de venta ${nombre_punto_venta || inventario.nombre_punto_venta}`,
        inventario,
    });
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al realizar la operación", error });
  }
};

// Eliminar un producto del inventario
const eliminarProductoInventario = async (req, res) => {
  const { inventarioId } = req.params;

  try {
    // Buscar el registro de inventario
    const inventario = await Inventario.findByPk(inventarioId);
    if (!inventario) {
      return res.status(404).json({ error: "Registro de inventario no encontrado" });
    }

    // Eliminar el registro de inventario
    await inventario.destroy();
    return res.status(200).json({ message: "Producto eliminado del inventario" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar producto del inventario" });
  }
};

// Revisar stock de un producto
const revisarStock = async (req, res) => {
  const { productoId } = req.params;

  try {
    // Obtener el stock total del producto en todas las ubicaciones
    const inventario = await Inventario.findAll({
      where: { producto_fk: productoId },
      attributes: ["punto_venta_fk", "nombre_punto_venta", "cantidad"],
    });

    if (!inventario || inventario.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado en el inventario" });
    }

    return res.status(200).json({
      productoId,
      stock: inventario.map((item) => ({
        punto_venta_fk: item.punto_venta_fk,
        nombre_punto_venta: item.nombre_punto_venta,
        cantidad: item.cantidad,
      })),
    });
  } catch (error) {
    console.error("Error al revisar el stock:", error);
    return res.status(500).json({ error: "Error al revisar el stock" });
  }
};


module.exports = {
  obtenerInventario,
  agregarProductoInventario,
  actualizarStock,
  eliminarProductoInventario,
  revisarStock,
};