const { Inventario, Producto } = require("../../models");
const { Op } = require("sequelize");

// Obtener el inventario
const obtenerInventario = async (req, res) => {
  try {
    const { page = 1, limit = 10, punto_venta_fk } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (punto_venta_fk) {
      whereClause.punto_venta_fk = punto_venta_fk;
    }

    const { count, rows: inventario } = await Inventario.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "nombre", "precio", "sku"],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      inventario,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el inventario" });
  }
};

// Agregar un producto al inventario
const agregarProductoInventario = async (req, res) => {
  const { productoId, cantidadInicial, puntoVentaId, nombrePuntoVenta } =
    req.body;

  try {
    // Verificar si el producto existe
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar/crear el inventario para este producto y punto de venta
    const [inventario, created] = await Inventario.findOrCreate({
      where: {
        producto_fk: productoId,
        punto_venta_fk: puntoVentaId, // Usamos el campo correcto en lugar de "ubicacion"
      },
      defaults: {
        cantidad: cantidadInicial || 0,
        nombre_punto_venta: nombrePuntoVenta, // Es importante incluir este campo porque es obligatorio en el modelo
      },
    });

    if (!created) {
      return res.status(409).json({
        message:
          "El producto ya existe en el inventario para este punto de venta",
      });
    }

    return res
      .status(201)
      .json({ message: "Producto agregado al inventario", inventario });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al agregar producto al inventario" });
  }
};

// Actualizar la cantidad de un producto (ventas o reabastecimiento)
const actualizarStock = async (req, res) => {
  console.log("req.params", req.params);
  console.log("req.body", req.body);
  const { sku } = req.params;
  const { cantidad, operacion, punto_venta_fk, nombre_punto_venta } = req.body;

  // Validar que 'cantidad' sea un número positivo
  if (!cantidad || typeof cantidad !== "number" || cantidad <= 0) {
    return res
      .status(400)
      .json({ mensaje: "La cantidad debe ser un número mayor a cero" });
  }

  // Validar que se proporcione el punto de venta
  if (!punto_venta_fk) {
    return res
      .status(400)
      .json({ mensaje: "El identificador del punto de venta es requerido" });
  }

  // Validar la operación
  if (!["venta", "reabastecimiento"].includes(operacion)) {
    return res.status(400).json({ mensaje: "Operación inválida" });
  }

  try {
    // Buscar el producto por SKU
    const producto = await Producto.findOne({ where: { sku } });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Buscar el inventario para el producto en el punto de venta especificado
    const inventario = await Inventario.findOne({
      where: {
        producto_fk: producto.id,
        punto_venta_fk,
      },
    });

    if (!inventario) {
      return res.status(404).json({
        mensaje: "Inventario no encontrado para este punto de venta",
      });
    }

    // Opcional: utilizar una transacción para asegurar la atomicidad de la operación
    // const transaction = await sequelize.transaction();

    // Realizar la operación utilizando métodos atómicos de Sequelize
    if (operacion === "venta") {
      if (inventario.cantidad < cantidad) {
        return res
          .status(400)
          .json({ mensaje: "Stock insuficiente para realizar la venta" });
      }
      await inventario.decrement("cantidad", { by: cantidad });
    } else if (operacion === "reabastecimiento") {
      await inventario.increment("cantidad", { by: cantidad });
    }

    // Actualizar el nombre del punto de venta si se proporcionó y es diferente
    if (
      nombre_punto_venta &&
      nombre_punto_venta !== inventario.nombre_punto_venta
    ) {
      inventario.nombre_punto_venta = nombre_punto_venta;
      await inventario.save();
    } else {
      // Recargar el registro para obtener el valor actualizado de 'cantidad'
      await inventario.reload();
    }

    // Opcional: confirmar la transacción
    // await transaction.commit();

    return res.status(200).json({
      mensaje: `Operación ${operacion} realizada con éxito en el punto de venta ${
        nombre_punto_venta || inventario.nombre_punto_venta
      }`,
      inventario,
    });
  } catch (error) {
    // Opcional: si se utilizó transacción, realizar rollback
    // if (transaction) await transaction.rollback();

    console.error("Error al actualizar el stock:", error);
    return res.status(500).json({
      mensaje: "Error al realizar la operación",
      error: error.message,
    });
  }
};

// Eliminar un producto del inventario
const eliminarProductoInventario = async (req, res) => {
  const { inventarioId } = req.params;

  // Validación básica: asegurarse de que se reciba un ID
  if (!inventarioId) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar el ID del inventario" });
  }

  try {
    // Buscar el registro de inventario por su ID
    const inventario = await Inventario.findByPk(inventarioId);
    if (!inventario) {
      return res
        .status(404)
        .json({ error: "Registro de inventario no encontrado" });
    }

    // Eliminar el registro de inventario (la relación entre producto y punto de venta)
    await inventario.destroy();

    return res
      .status(200)
      .json({ message: "Producto eliminado del inventario" });
  } catch (error) {
    console.error("Error al eliminar el producto del inventario:", error);
    return res
      .status(500)
      .json({ error: "Error al eliminar producto del inventario" });
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
      return res
        .status(404)
        .json({ mensaje: "Producto no encontrado en el inventario" });
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

const obtenerProductosNoVinculados = async (req, res) => {
  const { punto_venta_fk } = req.query;
  if (!punto_venta_fk) {
    return res
      .status(400)
      .json({ error: "El identificador del punto de venta es requerido" });
  }
  try {
    // Obtener los productos ya vinculados en el inventario para este punto de venta
    const inventarios = await Inventario.findAll({
      where: { punto_venta_fk },
      attributes: ["producto_fk"],
    });
    const vinculados = inventarios.map((item) => item.producto_fk);
    // Obtener los productos que NO están en la lista de vinculados
    const productosDisponibles = await Producto.findAll({
      where: {
        id: { [Op.notIn]: vinculados },
      },
      attributes: ["id", "nombre", "sku"],
    });
    return res.status(200).json({ productos: productosDisponibles });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al obtener productos disponibles" });
  }
};

module.exports = {
  obtenerInventario,
  agregarProductoInventario,
  actualizarStock,
  eliminarProductoInventario,
  revisarStock,
  obtenerProductosNoVinculados,
};
