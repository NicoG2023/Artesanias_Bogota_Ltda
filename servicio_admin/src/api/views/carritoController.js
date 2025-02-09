const { Carrito, Producto, REL_CarritoProducto } = require("../../models");
const sequelize = require("../../config/database");
const { getSignedUrl } = require("../../utils/cacheUtils");
const { getPuntosVentaByIds } = require("../../grpc/puntoVentaClientGrpc");

// Obtener el contenido del carrito
const obtenerCarrito = async (req, res) => {
  console.log("req", req.user.rol);
  try {
    const { userId } = req.user;
    const carrito = await Carrito.findOne({ where: { usuario_fk: userId } });

    if (!carrito) return res.status(200).json({ productos: [] });

    // Obtenemos los productos del carrito, incluyendo el campo "punto_venta_fk" de la relación
    const productos = await carrito.getProductos({
      attributes: ["id", "nombre", "precio", "imagen", "stripe_price_id"],
      joinTableAttributes: ["id", "cantidad", "punto_venta_fk"],
    });

    // Procesamos cada producto para obtener la URL firmada de la imagen
    const productosConImagen = await Promise.all(
      productos.map(async (producto) => {
        const prod = producto.get({ plain: true });
        if (prod.imagen) {
          const archivo = prod.imagen.split("/").pop();
          prod.imagen = await getSignedUrl(archivo, "r");
        }
        return prod;
      })
    );

    // Extraemos todos los IDs de punto de venta de los productos (tomando el valor de la relación)
    const puntoVentaIds = productosConImagen
      .map((prod) => prod.REL_CarritoProducto?.punto_venta_fk)
      .filter((id) => id !== undefined && id !== null);
    // Obtenemos los IDs únicos
    const idsUnicos = [...new Set(puntoVentaIds)];

    // Llamamos a getPuntosVentaByIds pasándole un array de IDs
    let puntosVenta = [];
    if (idsUnicos.length) {
      puntosVenta = await getPuntosVentaByIds(idsUnicos);
      // Se espera que puntosVenta sea un array con objetos { id, nombre, tipo, direccion }
    }

    // Para cada producto, asignamos la información del punto de venta
    const productosConPuntoVenta = productosConImagen.map((prod) => {
      const pvId = prod.REL_CarritoProducto?.punto_venta_fk;
      if (pvId) {
        // Buscamos el punto de venta que corresponda
        const puntoVenta = puntosVenta.find((pv) => pv.id === pvId);
        prod.puntoVenta = puntoVenta || null;
      } else {
        prod.puntoVenta = null;
      }
      return prod;
    });

    return res.status(200).json({ carrito, productos: productosConPuntoVenta });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// Agregar un producto al carrito
const agregarAlCarrito = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productoId, cantidad = 1, puntoVentaId } = req.body;
    const { userId } = req.user;

    // Validaciones básicas
    if (!productoId || isNaN(productoId)) {
      console.log("ID de producto inválido:", productoId); // Debugging
      await transaction.rollback();
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    if (!puntoVentaId || isNaN(puntoVentaId)) {
      console.log("ID de punto de venta inválido:", puntoVentaId); // Debugging
      await transaction.rollback();
      return res.status(400).json({ error: "ID de punto de venta inválido" });
    }

    if (cantidad < 1 || !Number.isInteger(cantidad)) {
      console.log("Cantidad inválida:", cantidad); // Debugging
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
      console.log("Producto no encontrado:", productoId); // Debugging
      await transaction.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (!producto.es_activo) {
      console.log("Producto no disponible:", productoId); // Debugging
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
        punto_venta_fk: puntoVentaId,
      },
      defaults: {
        cantidad: cantidad,
        carrito_fk: carrito.id,
        producto_fk: productoId,
        punto_venta_fk: puntoVentaId,
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
    console.error("error ", error);
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
