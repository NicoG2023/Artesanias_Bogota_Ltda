const {
  Orden,
  Pago,
  PuntoVenta,
  REL_Orden_Producto,
  sequelize,
} = require("../../models");
const { getUsersByIds, searchUsersByTerm } = require("../../userClientGrpc");
const { getProductsByIds } = require("../../productClientGrpc");
const { containerClient } = require("../../config/blob-storage");
const {
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  BlobSASPermissions,
} = require("@azure/storage-blob");

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
      p.imagen = p.imagen ? generarURLFirmada(p.imagen, "r") : p.imagen;
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
  const { usuario_fk } = req.params;
  const { page = 1 } = req.query;

  const limit = 15;
  const offset = (page - 1) * limit;

  try {
    const { rows: ordenesUsuario, count } = await Orden.findAndCountAll({
      where: { usuario_fk: usuario_fk },
      limit,
      offset,
      // Aquí indicamos el orden (columna, dirección)
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
        },
      ],
    });

    const total = count;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      message: `Lista de órdenes del usuario ${usuario_fk}`,
      data: ordenesUsuario,
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

const accountName = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error("Faltan AZURE_ACCOUNT_NAME o AZURE_ACCOUNT_KEY en el .env");
}

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

/**
 * Extrae el blobName y genera la URL firmada con permisos "permisos"
 * durante "expiracionEnHoras" horas (por defecto 5).
 */
function generarURLFirmada(urlCompleta, permisos = "r", expiracionEnHoras = 5) {
  try {
    // 1) Obtenemos solo el blobName (ej. "default-product.webp")
    const blobName = extraerBlobName(urlCompleta);

    // 2) Cálculo de expiración
    const expiresOn = new Date(Date.now() + expiracionEnHoras * 60 * 60 * 1000);

    // 3) Permisos en formato de BlobSASPermissions
    const sasPermissions = BlobSASPermissions.parse(permisos);
    // Por ejemplo, "r" => lectura

    // 4) Construimos las opciones para generar el SAS
    const sasOptions = {
      containerName: containerClient.containerName,
      blobName,
      permissions: sasPermissions,
      expiresOn,
    };

    // 5) Generamos el token
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();

    // 6) Retornamos la URL firmada
    // "https://artesaniasbogota2024.blob.core.windows.net/imagenes-artesanias/default-product.webp?<sas>"
    return `https://${accountName}.blob.core.windows.net/${containerClient.containerName}/${blobName}?${sasToken}`;
  } catch (error) {
    console.error("Error al generar URL firmada:", error.message);
    return null;
  }
}

/**
 * Extrae la parte final del blobName de una URL como:
 * "https://account.blob.core.windows.net/container/foo.jpg" => "foo.jpg"
 */
function extraerBlobName(urlCompleta) {
  if (!urlCompleta) return "";
  try {
    const urlObj = new URL(urlCompleta);
    const parts = urlObj.pathname.split("/");
    return parts[parts.length - 1] || "";
  } catch (err) {
    return urlCompleta; // fallback si no es una URL válida
  }
}

module.exports = {
  crearOrden,
  obtenerOrdenes,
  updateEstadoOrden,
  obtenerOrdenesPorUsuario,
};
