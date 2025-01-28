const { Carrito, Producto, REL_CarritoProducto } = require("../../models");

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
  const { productoId, cantidad } = req.body;
  const { userId } = req.user;

  try {
    // 1) Verificar si el producto existe
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // 2) Verificar/crear el carrito para este usuario
    const [carrito] = await Carrito.findOrCreate({
      where: { usuario_fk: userId },
      // Si quieres asignarle más campos por defecto, hazlo aquí
      defaults: {},
    });

    // 3) Verificar si el producto ya está en la tabla pivote para este carrito
    const [rel, created] = await REL_CarritoProducto.findOrCreate({
      where: {
        carrito_fk: carrito.id,
        producto_fk: productoId,
      },
      defaults: {
        cantidad: cantidad || 1,
      },
    });

    // 4) Si ya existía (created === false), entonces sumamos la nueva cantidad
    if (!created) {
      rel.cantidad += cantidad || 1;
      await rel.save();
    }

    return res.status(201).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

// Actualizar la cantidad de un producto en el carrito (tabla pivote)
const actualizarCantidad = async (req, res) => {
  const { itemId } = req.params; // itemId = ID de la fila en REL_CarritoProducto
  const { cantidad } = req.body;

  try {
    // 1) Buscar el registro en la tabla pivote
    const itemCarrito = await REL_CarritoProducto.findByPk(itemId);
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
  const { itemId } = req.params; // itemId = ID de la fila en REL_CarritoProducto
  const { userId } = req.user;  // Obtener el userId desde el token
  //edité esta parte, no esta funcional aun
  try {
    // 1) Buscar el carrito del usuario
    const carrito = await Carrito.findOne({ where: { usuario_fk: userId } });
    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado para este usuario" });
    }
    // 2) Buscar la relación pivote
    const itemCarrito = await REL_CarritoProducto.findOne({
      where: {
        carritoId: carrito.id,
        itemId: itemId,
      },
    });
    if (!itemCarrito) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    // 3) Eliminar la fila (relación) de la tabla pivote
    await itemCarrito.destroy();
    return res.status(200).json({ message: "Producto eliminado del carrito" });
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
