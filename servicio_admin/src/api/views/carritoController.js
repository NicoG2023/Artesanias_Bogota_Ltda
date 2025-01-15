const { Carrito, Producto, REL_CarritoProducto } = require("../../models");

// Obtener el contenido del carrito
const obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.user; // Se asume que el usuario está autenticado y el ID se encuentra en el token
    const carrito = await Carrito.findAll({
      where: { usuario_fk: userId },
      include: [
        {
          model: REL_CarritoProducto,
          attributes: ["id", "carrito_fk", "producto_fk", "cantidad"],
        },
      ],
    });

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// Agregar un producto al carrito
const agregarAlCarrito = async (req, res) => {
  const { productoId, cantidad } = req.body;
  const { userId } = req.user; // Se asume que el usuario está autenticado

  try {
    // Verificar si el producto existe
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si ya está en el carrito
    const [itemCarrito, created] = await Carrito.findOrCreate({
      where: { usuario_fk: userId, producto_fk: productoId },
      defaults: { cantidad },
    });

    if (!created) {
      // Si ya existe, actualizar la cantidad
      itemCarrito.cantidad += cantidad;
      await itemCarrito.save();
    }

    res.status(201).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

// Actualizar la cantidad de un producto en el carrito
const actualizarCantidad = async (req, res) => {
  const { itemId } = req.params;
  const { cantidad } = req.body;

  try {
    const itemCarrito = await Carrito.findByPk(itemId);
    if (!itemCarrito) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    if (cantidad <= 0) {
      await itemCarrito.destroy();
      return res.status(200).json({ message: "Producto eliminado del carrito" });
    }

    itemCarrito.cantidad = cantidad;
    await itemCarrito.save();

    res.status(200).json({ message: "Cantidad actualizada" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad" });
  }
};

// Eliminar un producto del carrito
const eliminarDelCarrito = async (req, res) => {
  const { itemId } = req.params;

  try {
    const itemCarrito = await Carrito.findByPk(itemId);
    if (!itemCarrito) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    await itemCarrito.destroy();
    res.status(200).json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar del carrito" });
  }
};

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
};