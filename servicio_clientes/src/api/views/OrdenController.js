const {
  Orden,
  Pago,
  PuntoVenta,
  REL_Orden_Producto,
  sequelize,
} = require("../../models");
const {
  getUsersByIds,
  searchUsersByTerm,
  getDireccionById,
} = require("../../grpc/userClientGrpc");
const { getProductsByIds } = require("../../grpc/productClientGrpc");
const { getSignedUrl } = require("../../utils/cacheUtils");
const { sendMessage } = require("../../kafka/kafkaProducer");

//Controlador para crear Orden
async function crearOrden(req, res) {
  try {
    const {
      usuario_fk,
      lugar_compra_fk,
      pago_fk,
      total,
      direccion_fk,
      productos = [],
    } = req.body;

    const nuevaOrden = await createOrderTransaction({
      usuario_fk,
      lugar_compra_fk,
      pago_fk,
      total,
      direccion_fk,
      productos,
    });

    return res.status(201).json({
      message: "Orden creada exitosamente",
      data: nuevaOrden,
    });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return res.status(500).json({
      message: "Error al crear la orden",
      error: error.message || error,
    });
  }
}

/**
 * Crea una orden con estado "CREADA" y sus productos relacionados.
 * Hace commit/rollback en caso de error.
 *
 * @param {object} data Objeto con los campos necesarios
 * @param {number} data.usuario_fk
 * @param {number|null} data.lugar_compra_fk
 * @param {number} data.pago_fk
 * @param {number} data.total
 * @param {number} data.direccion_fk
 * @param {Array}  data.productos - Array de objetos { producto_fk, cantidad }
 *
 * @returns {Orden} La instancia de la orden creada
 */
async function createOrderTransaction({
  usuario_fk,
  lugar_compra_fk,
  pago_fk,
  total,
  direccion_fk,
  productos = [],
  stripe_session_id,
  descuento_aplicado,
}) {
  const t = await sequelize.transaction();

  try {
    // 1) Crear la Orden
    const nuevaOrden = await Orden.create(
      {
        usuario_fk,
        lugar_compra_fk,
        estado: "CREADA", // Forzamos a "CREADA"
        pago_fk,
        total,
        direccion_fk,
        fecha_orden: new Date(),
        stripe_session_id,
        descuento_aplicado,
      },
      { transaction: t }
    );

    // 2) Insertar los productos en rel_orden_producto
    if (productos.length > 0) {
      const rels = productos.map((prod) => ({
        orden_fk: nuevaOrden.id,
        producto_fk: prod.producto_fk,
        cantidad: prod.cantidad,
      }));
      await REL_Orden_Producto.bulkCreate(rels, { transaction: t });
    }

    // 3) Confirmamos la transacción
    await t.commit();

    // 4) Puedes disparar la simulación de envío (si procede)
    simularEnvioOrden(nuevaOrden.id);

    return nuevaOrden;
  } catch (error) {
    // En caso de error, rollback
    await t.rollback();
    throw error;
  }
}

//Funcion para simular los cambios de estado
async function simularEnvioOrden(ordenId) {
  try {
    // A los 30 seg => pasar a "procesando"
    setTimeout(async () => {
      await actualizarEstadoOrdenInterno(ordenId, "procesando");
    }, 30000);

    // A los 30 seg => pasar a "EN_RUTA"
    setTimeout(async () => {
      await actualizarEstadoOrdenInterno(ordenId, "EN_RUTA");
    }, 30000);

    // A los 30 seg => pasar a "ENTREGADA"
    setTimeout(async () => {
      await actualizarEstadoOrdenInterno(ordenId, "ENTREGADA");
    }, 30000);
  } catch (error) {
    console.error("Error en simularEnvioOrden:", error);
  }
}

async function actualizarEstadoOrdenInterno(id, nuevoEstado) {
  const orden = await Orden.findByPk(id);

  if (!orden) return;

  orden.estado = nuevoEstado;
  await orden.save();

  console.log(`Orden #${id} actualizada a estado: ${nuevoEstado}`);

  if (global.io) {
    global.io.to(`orden-${id}`).emit("estadoActualizado", {
      ordenId: id,
      nuevoEstado,
    });
  }

  try {
    // 🔹 Obtener usuario mediante gRPC
    const usuarios = await getUsersByIds([orden.usuario_fk]);

    if (!usuarios || usuarios.length === 0) {
      console.error(
        `No se encontró información del usuario con ID: ${orden.usuario_fk}`
      );
      return;
    }

    const usuario = usuarios[0]; // Solo un usuario en la respuesta

    // 🔹 Enviar evento a Kafka para notificar al usuario por correo
    await sendMessage("ordenes-events", "estadoOrdenActualizado", {
      eventType: "ESTADO_ORDEN_ACTUALIZADO",
      payload: {
        ordenId: id,
        nuevoEstado,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    });

    console.log(`📩 Evento enviado a Kafka para notificar a ${usuario.email}`);
  } catch (error) {
    console.error("Error obteniendo usuario vía gRPC:", error);
  }
}

// Obtener todas las ordenes (sin importar el usuario)
const obtenerOrdenes = async (req, res) => {
  try {
    // 0) Leer query params
    const { page = 1, searchTerm = "" } = req.query;
    // Define aquí tu limit
    const limit = 20;
    const offset = (page - 1) * limit;

    // 1) Buscar usuarios si searchTerm
    let userIdsFilter = [];
    if (searchTerm) {
      const usersFound = await searchUsersByTerm(searchTerm);
      // => array de { id, nombre, apellido, email }
      userIdsFilter = usersFound.map((u) => u.id);

      // Si no hay usuarios hallados, ya no hay órdenes
      if (userIdsFilter.length === 0) {
        return res.json({
          message: "No hay órdenes que coincidan con la búsqueda",
          data: [],
          pagination: {
            page: Number(page),
            total: 0,
            pages: 0,
          },
        });
      }
    }

    // 2) Obtener órdenes, filtrando si userIdsFilter no está vacío
    const whereClause = {};
    if (userIdsFilter.length > 0) {
      whereClause.usuario_fk = userIdsFilter;
    }

    const { rows: ordenes, count } = await Orden.findAndCountAll({
      where: whereClause, // Aplica el filtro por usuario
      limit,
      offset,
      order: [["fecha_orden", "DESC"]],
      include: [
        { model: Pago, as: "pago" },
        { model: PuntoVenta, as: "puntoVenta" },
        { model: REL_Orden_Producto, as: "productosOrden" },
      ],
    });

    // 3) Recolectar IDs de usuario únicos de las órdenes
    const userIds = new Set(ordenes.map((o) => o.usuario_fk));

    // 4) Recolectar IDs de productos
    const productIds = new Set();
    ordenes.forEach((orden) => {
      orden.productosOrden.forEach((rel) => {
        productIds.add(rel.producto_fk);
      });
    });

    // 5) Llamar a microservicio de Usuarios en “bulk fetch”
    const usuarios = await getUsersByIds([...userIds]);
    // 6) Llamar a microservicio de Productos
    const productos = await getProductsByIds([...productIds]);

    // 7) Crear diccionarios
    const dictUsuarios = {};
    usuarios.forEach((u) => {
      dictUsuarios[u.id] = u;
    });

    const dictProductos = {};
    productos.forEach((p) => {
      // Firmar la imagen (opcional)
      p.imagen = p.imagen ? getSignedUrl(p.imagen, "r") : p.imagen;
      dictProductos[p.id] = p;
    });

    // 8) Fusionar la info en las órdenes
    const ordenesEnriquecidas = ordenes.map((o) => {
      const ordenJSON = o.toJSON();

      // Enriquecer usuario
      const userFound = dictUsuarios[o.usuario_fk];
      ordenJSON.usuarioNombre = userFound?.nombre || null;
      ordenJSON.usuarioApellido = userFound?.apellido || null;
      ordenJSON.usuarioEmail = userFound?.email || null;

      // Enriquecer cada REL_Orden_Producto con info del producto
      ordenJSON.productosOrden = ordenJSON.productosOrden.map((rel) => {
        const productoData = dictProductos[rel.producto_fk];
        return {
          ...rel,
          productoNombre: productoData?.nombre || null,
          productoImagen: productoData?.imagen || null,
          productoPrecio: productoData?.precio || null,
        };
      });

      return ordenJSON;
    });

    // 9) Responder
    return res.json({
      message: "Lista de órdenes con info de usuarios y productos",
      data: ordenesEnriquecidas,
      pagination: {
        page: Number(page),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return res.status(500).json({
      message: "Error al obtener las órdenes",
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
  console.log("req.params", req.params);
  const { usuario_fk } = req.params;
  const { page = 1 } = req.query;
  const limit = 15;
  const offset = (page - 1) * limit;

  try {
    // 1) Obtener las órdenes del usuario con relaciones básicas
    const { rows: ordenesUsuario, count } = await Orden.findAndCountAll({
      where: { usuario_fk: usuario_fk },
      limit,
      offset,
      order: [["fecha_orden", "DESC"]],
      include: [
        {
          model: Pago,
          as: "pago",
          attributes: ["fecha_pago"],
        },
        {
          model: PuntoVenta,
          as: "puntoVenta",
          attributes: ["nombre"],
        },
        {
          model: REL_Orden_Producto,
          as: "productosOrden",
          attributes: ["producto_fk", "cantidad"],
        },
      ],
    });

    const testProducts = await getProductsByIds([27]); // Un ID de prueba
    console.log("Respuesta del microservicio de productos:", testProducts);

    // 2) Recolectar todos los IDs de productos de todas las órdenes
    const productIds = new Set();
    ordenesUsuario.forEach((orden) => {
      orden.productosOrden.forEach((rel) => {
        productIds.add(rel.producto_fk);
      });
    });

    // 3) Recolectar todos los IDs de direcciones (direccion_fk) de las órdenes
    const direccionIds = new Set();
    ordenesUsuario.forEach((orden) => {
      // Solo agregamos si direccion_fk NO es null ni undefined
      if (orden.direccion_fk !== null && orden.direccion_fk !== undefined) {
        direccionIds.add(orden.direccion_fk);
      }
    });

    // 4) Consultar el microservicio de productos vía gRPC
    const products = await getProductsByIds([...productIds]);
    console.log("products", products);
    console.log("productsIds", productIds);
    const dictProductos = {};
    products.forEach((p) => {
      // Opcionalmente, podrías firmar la imagen aquí si es necesario
      dictProductos[p.id] = p;
    });

    // 5) Consultar (en paralelo) las direcciones vía gRPC (o bien, desde la BD del servicio de usuarios)
    // Se asume que getDireccionById está implementado en el servicio de usuarios vía gRPC.
    const dictDirecciones = {};
    await Promise.all(
      [...direccionIds].map(async (dirId) => {
        // Se pasa el id de la dirección y el usuario_fk obtenido de los parámetros
        console.log("dirId", dirId);
        const direccion = await getDireccionById(dirId, usuario_fk);
        dictDirecciones[dirId] = direccion;
      })
    );

    // 6) Enriquecer cada orden con la información de los productos y la dirección
    const ordenesEnriquecidas = ordenesUsuario.map((orden) => {
      const ordenJSON = orden.toJSON();
      ordenJSON.direccion = dictDirecciones[ordenJSON.direccion_fk] || null;

      // Enriquecer cada REL_Orden_Producto con la información del producto
      ordenJSON.productosOrden = ordenJSON.productosOrden.map((rel) => {
        const productoData = dictProductos[rel.producto_fk];
        return {
          ...rel,
          productoNombre: productoData ? productoData.nombre : null,
          productoImagen: productoData ? productoData.imagen : null,
          productoPrecio: productoData ? productoData.precio : null,
        };
      });

      // Agregar la dirección asociada a la orden
      ordenJSON.direccion = dictDirecciones[ordenJSON.direccion_fk] || null;

      return ordenJSON;
    });

    const total = count;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      message: `Lista de órdenes del usuario ${usuario_fk}`,
      data: ordenesEnriquecidas,
      pagination: {
        page: Number(page),
        total,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error al obtener las órdenes por usuario:", error);
    return res.status(500).json({
      message: "Error al obtener las órdenes por usuario",
      error: error.message || error,
    });
  }
};

const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Buscar la orden específica con sus relaciones
    const orden = await Orden.findOne({
      where: { id },
      include: [
        {
          model: Pago,
          as: "pago",
        },
        {
          model: PuntoVenta,
          as: "puntoVenta",
        },
        {
          model: REL_Orden_Producto,
          as: "productosOrden",
        },
      ],
    });

    if (!orden) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    // 2) Recolectar IDs de productos
    const productIds = new Set();
    orden.productosOrden.forEach((rel) => {
      productIds.add(rel.producto_fk);
    });

    // 3) Recolectar ID de dirección
    let direccionId = orden.direccion_fk;

    // 4) Obtener info de productos vía gRPC
    const products = await getProductsByIds([...productIds]);
    const dictProductos = {};
    products.forEach((p) => {
      // Podrías firmar la imagen si así lo requieres
      dictProductos[p.id] = p;
    });

    // 5) Obtener la dirección por gRPC (si aplica)
    let direccionData = null;
    if (direccionId !== null && direccionId !== undefined) {
      // Se asume que la orden tiene un usuario_fk
      direccionData = await getDireccionById(direccionId, orden.usuario_fk);
    }

    // 6) Enriquecer los productos en la orden
    const ordenJSON = orden.toJSON();
    ordenJSON.productosOrden = ordenJSON.productosOrden.map((rel) => {
      const pData = dictProductos[rel.producto_fk];
      return {
        ...rel,
        productoNombre: pData?.nombre || null,
        productoImagen: pData?.imagen || null,
        productoPrecio: pData?.precio || null,
      };
    });

    // 7) Agregar la dirección
    ordenJSON.direccion = direccionData || null;

    // 8) Responder con la orden enriquecida
    return res.json({
      message: "Orden encontrada",
      data: ordenJSON,
    });
  } catch (error) {
    console.error("Error al obtener la orden por ID:", error);
    return res.status(500).json({
      message: "Error al obtener la orden",
      error: error.message || error,
    });
  }
};

async function obtenerOrdenPorSessionId(req, res) {
  console.log("req.query", req.params);
  const { sessionId } = req.params;
  console.log("sessionId", sessionId);

  const orden = await Orden.findOne({
    where: { stripe_session_id: sessionId },
    include: [
      {
        model: Pago,
        as: "pago",
      },
      {
        model: PuntoVenta,
        as: "puntoVenta",
      },
      {
        model: REL_Orden_Producto,
        as: "productosOrden",
      },
    ],
  });
  if (!orden) {
    return res.status(404).json({ message: "Orden no encontrada" });
  }

  const productIds = new Set();
  orden.productosOrden.forEach((rel) => {
    productIds.add(rel.producto_fk);
  });

  // 3) Recolectar ID de dirección
  let direccionId = orden.direccion_fk;

  // 4) Obtener info de productos vía gRPC
  const products = await getProductsByIds([...productIds]);
  console.log("obtiene products");
  const dictProductos = {};
  products.forEach((p) => {
    // Podrías firmar la imagen si así lo requieres
    dictProductos[p.id] = p;
  });
  console.log("llena dictProductos");

  // 5) Obtener la dirección por gRPC (si aplica)
  let direccionData = null;
  if (direccionId) {
    // Suponiendo que la orden tiene un usuario_fk
    direccionData = await getDireccionById(direccionId, orden.usuario_fk);
  }

  // 6) Enriquecer los productos en la orden
  const ordenJSON = orden.toJSON();
  ordenJSON.productosOrden = ordenJSON.productosOrden.map((rel) => {
    const pData = dictProductos[rel.producto_fk];
    return {
      ...rel,
      productoNombre: pData?.nombre || null,
      productoImagen: pData?.imagen || null,
      productoPrecio: pData?.precio || null,
    };
  });

  // 7) Agregar la dirección
  ordenJSON.direccion = direccionData || null;

  // 8) Responder con la orden enriquecida
  console.log("orden encontrada");
  return res.json({
    message: "Orden encontrada",
    data: ordenJSON,
  });
}

module.exports = {
  crearOrden,
  obtenerOrdenes,
  updateEstadoOrden,
  obtenerOrdenesPorUsuario,
  obtenerOrdenPorId,
  createOrderTransaction,
  obtenerOrdenPorSessionId,
};
