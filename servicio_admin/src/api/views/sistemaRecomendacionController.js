const { getOrdenesByUserId } = require("../../grpc/puntoVentaClientGrpc");
const {
  Producto,
  REL_ProductoCategoria,
  Categoria,
  Inventario,
  sequelize,
} = require("../../models");
const redisClient = require("../../config/redisClient");
const { Op } = require("sequelize");
const { getSignedUrl } = require("../../utils/cacheUtils");

const getRecomendacionProductos = async (req, res) => {
  try {
    const { userId } = req.params;
    const forceRefresh = req.query.refresh === "true"; // Forzar actualización

    if (!userId) {
      return res.status(400).json({ message: "El userId es requerido" });
    }

    const cacheKey = `recomendaciones:${userId}`;

    // 🔹 1️⃣ Buscar en Redis SOLO si no se fuerza la actualización
    if (!forceRefresh) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.json({ data: JSON.parse(cachedData) });
      }
    }

    // 🔹 2️⃣ Obtener IDs de productos comprados por el usuario
    const productosComprados = await getOrdenesByUserId(parseInt(userId));
    if (!productosComprados.length) {
      return res.json({
        data: [],
        message: "El usuario no ha comprado productos.",
      });
    }

    // 🔹 3️⃣ Obtener características de los productos comprados
    const productosDetalles = await Producto.findAll({
      attributes: ["id", "color", "talla"],
      where: { id: { [Op.in]: productosComprados } },
      raw: true,
    });

    const colores = [
      ...new Set(productosDetalles.map((p) => p.color).filter(Boolean)),
    ];
    const tallas = [
      ...new Set(productosDetalles.map((p) => p.talla).filter(Boolean)),
    ];

    // 🔹 4️⃣ Obtener categorías de los productos comprados
    const categoriasIds = await REL_ProductoCategoria.findAll({
      attributes: ["categoria_fk"],
      where: { producto_fk: { [Op.in]: productosComprados } },
      raw: true,
    });

    const categorias = [...new Set(categoriasIds.map((c) => c.categoria_fk))];

    // 🔹 5️⃣ Buscar productos similares
    const productosSimilares = await Producto.findAll({
      attributes: [
        "id",
        "nombre",
        "sku",
        "precio",
        "descripcion",
        "imagen",
        "es_activo",
        "color",
        "talla",
        "rating",
      ],
      where: {
        id: { [Op.notIn]: productosComprados },
        es_activo: true,
        [Op.or]: [
          { color: { [Op.in]: colores } },
          { talla: { [Op.in]: tallas } },
          { id: { [Op.in]: categorias.length ? categorias : [-1] } },
        ],
      },
      order: sequelize.random(),
      limit: 12,
      raw: true,
    });

    if (!productosSimilares.length) {
      return res.json({
        data: [],
        message: "No hay recomendaciones disponibles.",
      });
    }

    const productosIds = productosSimilares.map((p) => p.id);

    // 🔹 6️⃣ Obtener categorías de los productos recomendados
    const categoriasProductos = await REL_ProductoCategoria.findAll({
      attributes: ["producto_fk", "categoria_fk"],
      where: { producto_fk: { [Op.in]: productosIds } },
      raw: true,
    });

    const categoriasInfo = await Categoria.findAll({
      attributes: ["id", "nombre"],
      where: {
        id: { [Op.in]: categoriasProductos.map((c) => c.categoria_fk) },
      },
      raw: true,
    });

    // Mapear categorías con productos
    const categoriasMap = categoriasProductos.reduce((acc, item) => {
      if (!acc[item.producto_fk]) acc[item.producto_fk] = [];
      const categoria = categoriasInfo.find((c) => c.id === item.categoria_fk);
      if (categoria) {
        acc[item.producto_fk].push(categoria);
      }
      return acc;
    }, {});

    // 🔹 7️⃣ Obtener stock en inventario con punto_venta_fk = 1
    const inventario = await Inventario.findAll({
      attributes: ["producto_fk", "cantidad"],
      where: { producto_fk: { [Op.in]: productosIds }, punto_venta_fk: 1 },
      raw: true,
    });

    const inventarioMap = inventario.reduce((acc, item) => {
      acc[item.producto_fk] = item.cantidad;
      return acc;
    }, {});

    // 🔹 8️⃣ Firmar URLs de imágenes
    const productosFinales = await Promise.all(
      productosSimilares.map(async (producto) => {
        let imagenFirmada = producto.imagen;
        if (producto.imagen) {
          const archivo = producto.imagen.split("/").pop();
          imagenFirmada = await getSignedUrl(archivo, "r");
        }

        return {
          id: producto.id,
          nombre: producto.nombre,
          sku: producto.sku,
          precio: new Intl.NumberFormat("es-CO").format(producto.precio / 100),
          descripcion: producto.descripcion,
          imagen: imagenFirmada,
          es_activo: producto.es_activo,
          color: producto.color,
          talla: producto.talla,
          rating: producto.rating,
          categorias: categoriasMap[producto.id] || [],
          stock: inventarioMap[producto.id] || 0,
        };
      })
    );

    // 🔹 9️⃣ Almacenar en Redis con TTL de 24 horas
    await redisClient.setEx(cacheKey, 86400, JSON.stringify(productosFinales));
    console.log("Productos recomendados actualizados:", productosFinales);

    return res.json({ data: productosFinales });
  } catch (error) {
    console.error("Error en getRecomendacionProductos:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
};

module.exports = { getRecomendacionProductos };
