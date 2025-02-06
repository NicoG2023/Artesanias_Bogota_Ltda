const { Carrito, Producto, REL_CarritoProducto } = require("../../models");
const sequelize = require("../../config/database");
const { getSignedUrl } = require("../../utils/cacheUtils");

// Obtener el contenido del carrito
const obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.user;
    const carrito = await Carrito.findOne({ where: { usuario_fk: userId } });

    if (!carrito) return res.status(200).json({ productos: [] });

    const productos = await carrito.getProductos({
      attributes: ["id", "nombre", "precio", "imagen"],
      joinTableAttributes: ["id", "cantidad"],
    });

    // Procesamos cada producto para obtener la URL firmada de la imagen
    const productosConImagen = await Promise.all(
      productos.map(async (producto) => {
        // Convertimos la instancia a objeto plano
        const prod = producto.get({ plain: true });
        if (prod.imagen) {
          // Extraemos el nombre del blob, asumiendo que la URL es algo como:
          // "https://<cuenta>.blob.core.windows.net/<container>/archivo.ext"
          const archivo = prod.imagen.split("/").pop();
          // Obtenemos la URL firmada (esta función utiliza Redis para cachear el resultado)
          prod.imagen = await getSignedUrl(archivo, "r");
        }
        return prod;
      })
    );

    return res.status(200).json({ carrito, productos: productosConImagen });
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
  console.log("req.params:", req.params); // Debugging
  console.log("req.body:", req.body); // Debugging
  const { userId, productoId } = req.params;
  const { cantidad } = req.body;

  try {
    const carrito = await Carrito.findOne({ where: { usuario_fk: userId } });

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const [updateRows] = await REL_CarritoProducto.update(
      { cantidad },
      {
        where: { carrito_fk: carrito.id, producto_fk: productoId },
        returning: true,
      }
    );

    if (!updateRows) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    if (cantidad <= 0) {
      await REL_CarritoProducto.destroy({ where: { id: productoId } });
      return res
        .status(200)
        .json({ message: "Producto eliminado del carrito" });
    }

    return res.status(200).json({ message: "Cantidad actualizada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar la cantidad" });
  }
};

// Eliminar un producto del carrito
const eliminarDelCarrito = async (req, res) => {
  console.log("req.params:", req.params); // Debugging
  const { userId, productoId } = req.params;

  try {
    // 1) Buscar el carrito del usuario
    const carrito = await Carrito.findOne({ where: { usuario_fk: userId } });

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // 2) Buscar y validar la relación
    const itemCarrito = await REL_CarritoProducto.findOne({
      where: {
        producto_fk: productoId,
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

// Limpieza automática de carritos inactivos cada 24h
setInterval(async () => {
  const expiredTime = new Date();
  expiredTime.setHours(expiredTime.getHours() - 48); // Carritos sin actualizar en 48h

  await Carrito.destroy({
    where: {
      updatedAt: { [Op.lt]: expiredTime },
    },
  });

  console.log("Carritos inactivos eliminados");
}, 86400000); // Ejecuta cada 24h

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
};
