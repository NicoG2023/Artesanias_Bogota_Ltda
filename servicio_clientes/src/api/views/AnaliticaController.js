// controllers/analyticsController.js
const { Pago, Orden, REL_Orden_Producto, sequelize } = require("../../models");
const { Op } = require("sequelize");
const { getUsersByVendedorFk, getUsersByIds } = require("../../grpc/userClientGrpc");
const stripe = require("../../config/stripe");
const redisClient = require("../../config/redisClient");

async function getEmpleadosConMasDineroGenerado(req, res) {
  try {
    const { month, year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Debe proporcionar el año" });
    }

    const y = parseInt(year);
    const m = month ? parseInt(month) : null;

    if (isNaN(y)) {
      return res
        .status(400)
        .json({ message: "Mes y año deben ser números válidos" });
    }

    // Definir el rango de fechas
    const startDate = new Date(y, m ? m - 1 : 0, 1); // Si no hay mes, empieza desde enero
    const endDate = new Date(y, m ? m : 12, 1); // Si no hay mes, termina en diciembre

    // Generar una clave única para el caché
    const cacheKey = `empleadosConMasDineroGenerado:${y}:${m || "annual"}`;

    // Intentar obtener los datos del caché
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // Si los datos están en caché, devolverlos
      return res.json({ data: JSON.parse(cachedData) });
    }

    // Obtener ventas agrupadas por vendedor
    const ventas = await Pago.findAll({
      attributes: [
        "vendedor_fk",
        [
          sequelize.fn("SUM", sequelize.col("monto_transaccion")),
          "total_ventas",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "cantidad_ventas"],
      ],
      where: {
        vendedor_fk: { [Op.ne]: null },
        fecha_pago: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      group: ["vendedor_fk"],
      order: [[sequelize.literal("total_ventas"), "DESC"]],
      limit: 5, // 🔹 Solo los 5 primeros empleados
      raw: true,
    });

    if (ventas.length === 0) {
      return res.json({ data: [] });
    }

    // Obtener IDs únicos de vendedores
    const vendedorIds = [...new Set(ventas.map((v) => v.vendedor_fk))];

    // Obtener información de los vendedores vía gRPC
    const vendedores = await getUsersByVendedorFk(vendedorIds);

    // Mapear vendedores con sus ventas
    const ventasConNombres = ventas.map((venta) => {
      const vendedor = vendedores.find((v) => v.id === venta.vendedor_fk) || {};
      return {
        vendedor_fk: venta.vendedor_fk,
        nombre: vendedor.nombre || "Desconocido",
        apellido: vendedor.apellido || "",
        total_ventas: venta.total_ventas,
        cantidad_ventas: venta.cantidad_ventas,
      };
    });

    // Almacenar los datos en caché con una expiración de 10 minutos (600 segundos)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(ventasConNombres));

    return res.json({ data: ventasConNombres });
  } catch (error) {
    console.error("Error al obtener empleados con más dinero generado:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
}

async function getEmpleadosConMasVentas(req, res) {
  try {
    const { month, year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Debe proporcionar el año" });
    }

    const y = parseInt(year);
    const m = month ? parseInt(month) : null;

    if (isNaN(y)) {
      return res
        .status(400)
        .json({ message: "Mes y año deben ser números válidos" });
    }

    // Definir el rango de fechas
    const startDate = new Date(y, m ? m - 1 : 0, 1);
    const endDate = new Date(y, m ? m : 12, 1);

    // Obtener las órdenes con pago asociado
    const ordenes = await Orden.findAll({
      attributes: ["id", "pago_fk"],
      where: { pago_fk: { [Op.ne]: null } },
      raw: true,
    });

    if (ordenes.length === 0) {
      return res.json({ data: [] });
    }

    const pagoIds = ordenes.map((orden) => orden.pago_fk);

    // Obtener los pagos con vendedor válido y dentro del rango de fechas
    const pagos = await Pago.findAll({
      attributes: ["id", "vendedor_fk"],
      where: {
        id: { [Op.in]: pagoIds },
        vendedor_fk: { [Op.ne]: null },
        fecha_pago: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      raw: true,
    });

    if (pagos.length === 0) {
      return res.json({ data: [] });
    }

    const vendedorIds = [...new Set(pagos.map((pago) => pago.vendedor_fk))];
    const pagoIdSet = new Set(pagos.map((pago) => pago.id));

    // 🔹 Obtener cantidad total de productos vendidos por vendedor con alias correcto
    const productosVendidos = await REL_Orden_Producto.findAll({
      attributes: [
        [sequelize.col("orden.pago_fk"), "pago_fk"],
        [sequelize.fn("SUM", sequelize.col("cantidad")), "total_productos"],
      ],
      include: [
        {
          model: Orden,
          as: "orden", // 🔹 Alias correcto
          attributes: [],
          where: { pago_fk: { [Op.in]: Array.from(pagoIdSet) } },
        },
      ],
      group: ["orden.pago_fk"],
      raw: true,
    });

    if (productosVendidos.length === 0) {
      return res.json({ data: [] });
    }

    // 🔹 Combinar datos de productos vendidos con vendedores
    const ventasPorVendedor = productosVendidos
      .map((venta) => {
        const pago = pagos.find((p) => p.id === venta.pago_fk);
        return {
          vendedor_fk: pago ? pago.vendedor_fk : null,
          total_productos: venta.total_productos,
        };
      })
      .filter((v) => v.vendedor_fk !== null);

    // 🔹 Agrupar cantidad total de productos vendidos por vendedor
    const ventasAgrupadas = ventasPorVendedor.reduce((acc, venta) => {
      acc[venta.vendedor_fk] =
        (acc[venta.vendedor_fk] || 0) + parseInt(venta.total_productos);
      return acc;
    }, {});

    // 🔹 Convertir a array y ordenar por productos vendidos
    const topVendedores = Object.entries(ventasAgrupadas)
      .map(([vendedor_fk, total_productos]) => ({
        vendedor_fk: parseInt(vendedor_fk),
        total_productos,
      }))
      .sort((a, b) => b.total_productos - a.total_productos)
      .slice(0, 5); // Solo los 5 mejores

    if (topVendedores.length === 0) {
      return res.json({ data: [] });
    }

    // 🔹 Obtener nombres de los vendedores vía gRPC
    const vendedores = await getUsersByVendedorFk(
      topVendedores.map((v) => v.vendedor_fk)
    );

    // 🔹 Mapear vendedores con sus ventas
    const ventasConNombres = topVendedores.map((venta) => {
      const vendedor = vendedores.find((v) => v.id === venta.vendedor_fk) || {};
      return {
        vendedor_fk: venta.vendedor_fk,
        nombre: vendedor.nombre || "Desconocido",
        apellido: vendedor.apellido || "",
        total_productos: venta.total_productos,
      };
    });

    return res.json({ data: ventasConNombres });
  } catch (error) {
    console.error(
      "Error al obtener empleados con más productos vendidos:",
      error
    );
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
}

async function getProductosMasVendidos(req, res) {
  try {
    const { month, year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Debe proporcionar el año" });
    }

    const y = parseInt(year);
    const m = month ? parseInt(month) : null;

    if (isNaN(y)) {
      return res
        .status(400)
        .json({ message: "Mes y año deben ser números válidos" });
    }

    // Definir el rango de fechas
    const startDate = new Date(y, m ? m - 1 : 0, 1);
    const endDate = new Date(y, m ? m : 12, 1);

    // Generar una clave única para el caché
    const cacheKey = `productosMasVendidos:${y}:${m || "annual"}`;

    // Intentar obtener los datos del caché
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // Si los datos están en caché, devolverlos
      return res.json({ data: JSON.parse(cachedData) });
    }

    // Si los datos no están en caché, obtenerlos de Stripe
    let ventasProductos = {};

    const sesionesIterator = stripe.checkout.sessions.list({
      limit: 100,
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lt: Math.floor(endDate.getTime() / 1000),
      },
    });

    for await (const sesion of sesionesIterator) {
      const items = await stripe.checkout.sessions.listLineItems(sesion.id);

      for (const item of items.data) {
        const productoId = item.price.product;
        const cantidad = item.quantity;

        ventasProductos[productoId] = (ventasProductos[productoId] || 0) + cantidad;
      }
    }

    // Ordenar los productos por cantidad vendida en orden descendente y limitar a los primeros 10
    const productosMasVendidos = Object.entries(ventasProductos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productoId, cantidad]) => ({ productoId, cantidad }));

    // Obtener los nombres de los productos desde Stripe
    const productosConNombres = await Promise.all(productosMasVendidos.map(async (venta) => {
      const producto = await stripe.products.retrieve(venta.productoId);
      return {
        productoId: venta.productoId,
        nombre: producto.name,
        cantidad: venta.cantidad,
      };
    }));

    // Almacenar los datos en caché con una expiración de 10 minutos (600 segundos)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(productosConNombres));

    return res.json({ data: productosConNombres });
  } catch (error) {
    console.error('Error al obtener y ordenar los productos:', error);
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
}

async function getClientesConMasCompras(req, res) {
  try {
    const { month, year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Debe proporcionar el año" });
    }

    const y = parseInt(year);
    const m = month ? parseInt(month) : null;

    if (isNaN(y)) {
      return res
        .status(400)
        .json({ message: "Mes y año deben ser números válidos" });
    }

    // Definir el rango de fechas
    const startDate = new Date(y, m ? m - 1 : 0, 1);
    const endDate = new Date(y, m ? m : 12, 1);

    // Generar una clave única para el caché
    const cacheKey = `clientesConMasCompras:${y}:${m || "annual"}`;

    // Intentar obtener los datos del caché
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // Si los datos están en caché, devolverlos
      return res.json({ data: JSON.parse(cachedData) });
    }

    // Si los datos no están en caché, obtenerlos de Stripe
    let comprasClientes = {};

    const sesionesIterator = stripe.checkout.sessions.list({
      limit: 100,
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lt: Math.floor(endDate.getTime() / 1000),
      },
    });

    for await (const sesion of sesionesIterator) {
      if (!sesion.metadata.usuario_fk) {
        continue; // Saltar a la siguiente sesión si no hay customer
      }

      const clienteId = sesion.metadata.usuario_fk;
      const items = await stripe.checkout.sessions.listLineItems(sesion.id);

      for (const item of items.data) {
        const cantidad = item.quantity;
        comprasClientes[clienteId] = (comprasClientes[clienteId] || 0) + cantidad;
      }
    }

    // Ordenar los clientes por cantidad comprada en orden descendente y limitar a los primeros 10
    const clientesMasCompras = Object.entries(comprasClientes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([clienteId, cantidad]) => ({ clienteId, cantidad }));

    // Obtener los nombres de los clientes desde gRPC
    const clienteIds = clientesMasCompras.map((compra) => compra.clienteId);
    const clientes = await getUsersByIds(clienteIds);

    // Mapear los nombres de los clientes en el resultado final
    const clientesConNombres = clientesMasCompras.map((compra) => {
      const cliente = clientes.find((c) => c.id === compra.clienteId);
      return {
        clienteId: compra.clienteId,
        nombre: cliente.nombre,
        cantidad: compra.cantidad,
      };
    });

    // Almacenar los datos en caché con una expiración de 10 minutos (600 segundos)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(clientesConNombres));

    return res.json({ data: clientesConNombres });
  } catch (error) {
    console.error('Error al obtener y ordenar los clientes:', error);
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
}

async function getTotalVentas(req, res) {
  try {
    const { month, year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Debe proporcionar el año" });
    }

    const y = parseInt(year);
    const m = month ? parseInt(month) : null;

    if (isNaN(y)) {
      return res.status(400).json({ message: "Mes y año deben ser números válidos" });
    }

    // Definir el rango de fechas
    const startDate = new Date(y, m ? m - 1 : 0, 1);
    const endDate = new Date(y, m ? m : 12, 1);

    // Generar una clave única para el caché
    const cacheKey = `totalVentas:${y}:${m || "annual"}`;

    // Intentar obtener los datos del caché
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // Si los datos están en caché, devolverlos
      return res.json({ data: JSON.parse(cachedData) });
    }

    // Obtener ventas agrupadas por mes
    const ventas = await Pago.findAll({
      attributes: [
        [sequelize.fn("DATE_TRUNC", "month", sequelize.col("fecha_pago")), "mes"],
        [sequelize.fn("SUM", sequelize.col("monto_transaccion")), "total_ventas"],
      ],
      where: {
        fecha_pago: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      group: [sequelize.fn("DATE_TRUNC", "month", sequelize.col("fecha_pago"))],
      order: [[sequelize.fn("DATE_TRUNC", "month", sequelize.col("fecha_pago")), "ASC"]],
      raw: true,
    });

    const ventasPorMes = ventas.map((venta) => ({
      mes: venta.mes,
      total_ventas: parseFloat(venta.total_ventas),
    }));

    // Almacenar los datos en caché con una expiración de 10 minutos (600 segundos)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(ventasPorMes));

    return res.json({ data: ventasPorMes });
  } catch (error) {
    console.error("Error al obtener el total de ventas:", error);
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
}

module.exports = { 
  getEmpleadosConMasVentas,
  getEmpleadosConMasDineroGenerado,
  getProductosMasVendidos,
  getClientesConMasCompras,
  getTotalVentas 
};