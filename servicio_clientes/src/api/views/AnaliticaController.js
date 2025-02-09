// controllers/analyticsController.js
const { Pago, sequelize } = require("../../models");
const { Op } = require("sequelize");
const { getUsersByVendedorFk } = require("../../grpc/userClientGrpc");

async function getEmpleadosConMasVentas(req, res) {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Debe proporcionar mes y año" });
    }

    const m = parseInt(month);
    const y = parseInt(year);
    if (isNaN(m) || isNaN(y)) {
      return res
        .status(400)
        .json({ message: "Mes y año deben ser números válidos" });
    }

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 1);

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

    console.log("Ventas con nombres:", ventasConNombres);

    return res.json({ data: ventasConNombres });
  } catch (error) {
    console.error("Error al obtener empleados con más ventas:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
}

module.exports = { getEmpleadosConMasVentas };
