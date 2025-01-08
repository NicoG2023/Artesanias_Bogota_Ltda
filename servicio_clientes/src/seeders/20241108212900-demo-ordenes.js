"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener IDs de puntos de venta existentes
    const puntosVenta = await queryInterface.sequelize.query(
      `SELECT id FROM puntos_venta;`
    );
    const puntosVentaIds = puntosVenta[0].map((pv) => pv.id);

    // Obtener IDs de pagos existentes
    const pagos = await queryInterface.sequelize.query(
      `SELECT id, monto_transaccion FROM pagos;`
    );
    const pagosData = pagos[0];

    const ordenes = [];

    for (let i = 0; i < 50; i++) {
      const pago = faker.helpers.arrayElement(pagosData);

      const orden = {
        usuario_fk: faker.number.int({ min: 1, max: 120 }),
        lugar_compra_fk: faker.helpers.arrayElement(puntosVentaIds),
        estado: faker.helpers.arrayElement([
          "pendiente",
          "procesando",
          "enviado",
          "entregado",
        ]),
        pago_fk: pago.id,
        total: pago.monto_transaccion, // Asegurar que el total coincida con el pago
        fecha_orden: faker.date.recent(),
      };

      ordenes.push(orden);
    }

    return queryInterface.bulkInsert("ordenes", ordenes, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ordenes", null, {});
  },
};
