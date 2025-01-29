const { Carrito, Producto, REL_CarritoProducto } = require("../../models");
const { sequelize } = require("../../config/database");

// Obtener el contenido del carrito
const obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.user;
    // 1) Hallar el carrito de este usuario
    //    Si un usuario solo tiene un carrito, es mejor usar findOne en vez de findAll
    const carrito = await Carrito.findOne({
      where: { usuario_fk: userId },
      include: [
        {
          model: Producto,
          as: "productos",
          attributes: ["id", "nombre", "precio"], // O los campos que necesites
          through: {
            model: REL_CarritoProducto,
            attributes: ["id", "cantidad"], // Campos que desees exponer de la tabla pivote
          },
        },
      ],
    });

    // Si no tiene carrito, podríamos retornar un arreglo vacío
    if (!carrito) {
      return res.status(200).json({ productos: [] });
    }

    // Retornamos el carrito con sus productos
    return res.status(200).json(carrito);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// Agregar un producto al carrito
const agregarAlCarrito = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productoId, cantidad = 1 } = req.body;
    const { userId } = req.user;

    // Validaciones básicas
    if (!productoId || isNaN(productoId)) {
      await transaction.rollback();
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    if (cantidad < 1 || !Number.isInteger(cantidad)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Cantidad debe ser un entero positivo" });
    }

    // Verificar producto (con transacción)
    const producto = await Producto.findByPk(productoId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!producto) {
      await transaction.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (!producto.es_activo) {
      await transaction.rollback();
      return res.status(400).json({ error: "Producto no disponible" });
    }

    // Obtener o crear carrito (con transacción)
    const [carrito] = await Carrito.findOrCreate({
      where: { usuario_fk: userId },
      defaults: { usuario_fk: userId },
      transaction,
    });

    // Buscar o crear relación (con lock para evitar race conditions)
    const [relacion, created] = await REL_CarritoProducto.findOrCreate({
      where: {
        carrito_fk: carrito.id,
        producto_fk: productoId,
      },
      defaults: {
        cantidad: cantidad,
        carrito_fk: carrito.id,
        producto_fk: productoId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    // Si ya existía, actualizar cantidad atómicamente
    if (!created) {
      await relacion.increment("cantidad", {
        by: cantidad,
        transaction,
      });
    }

    // Commit de la transacción
    await transaction.commit();

    return res.status(201).json({
      message: "Producto agregado al carrito",
      itemId: relacion.id,
      nuevaCantidad: created ? cantidad : relacion.cantidad + cantidad,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error en transacción:", error);

    // Manejar errores específicos de Sequelize
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ error: "Conflicto de datos, intente nuevamente" });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: error.errors.map((e) => e.message),
      });
    }

    return res.status(500).json({
      error: "Error al procesar el carrito",
      detalles: error.message,
    });
  }
};

// Actualizar la cantidad de un producto en el carrito (tabla pivote)
const actualizarCantidad = async (req, res) => {
  const { itemId } = req.params; // itemId = ID de la fila en REL_CarritoProducto
  const { userId } = req.params;
  const { cantidad } = req.body;

  try {
    // 1) Buscar el registro en la tabla pivote
    const itemCarrito = await REL_CarritoProducto.findOne({
      include: [
        {
          model: Carrito,
          as: "carritos",
          where: { usuario_fk: userId },
        },
      ],
      where: { id: itemId },
    });
    if (!itemCarrito) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    // 2) Si la cantidad es menor o igual a 0, eliminamos ese producto del carrito
    if (cantidad <= 0) {
      await itemCarrito.destroy();
      return res
        .status(200)
        .json({ message: "Producto eliminado del carrito" });
    }

    // 3) Si es mayor a 0, actualizamos la cantidad
    itemCarrito.cantidad = cantidad;
    await itemCarrito.save();

    return res.status(200).json({ message: "Cantidad actualizada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar la cantidad" });
  }
};

// Eliminar un producto del carrito
const eliminarDelCarrito = async (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.user;

  try {
    // 1) Buscar el carrito del usuario
    const carrito = await Carrito.findOne({
      where: { usuario_fk: userId },
    });
    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // 2) Buscar y validar la relación
    const itemCarrito = await REL_CarritoProducto.findOne({
      where: {
        id: itemId,
        carrito_fk: carrito.id,
      },
    });

    if (!itemCarrito) {
      return res
        .status(404)
        .json({ error: "Ítem no encontrado en el carrito" });
    }

    // 3) Eliminar
    await itemCarrito.destroy();
    return res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar del carrito" });
  }
};

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
};
