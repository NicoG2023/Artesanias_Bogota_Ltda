"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const pagos = [];

    for (let i = 0; i < 50; i++) {
      const pago = {
        usuario_fk: faker.number.int({ min: 1, max: 120 }), // IDs de usuarios entre 1 y 120
        cliente_id: faker.string.uuid(), // Genera un UUID
        intencion_pago_id: faker.string.uuid(),
        metodo_pago_id: faker.helpers.arrayElement([
          "card",
          "paypal",
          "stripe",
        ]),
        monto_transaccion: faker.finance.amount(20, 1000, 2),
        moneda_transaccion: "USD",
        estado: faker.helpers.arrayElement([
          "pendiente",
          "completado",
          "fallido",
        ]),
        descripcion: faker.commerce.productDescription(),
        fecha_pago: faker.date.recent(),
      };

      pagos.push(pago);
    }

    return queryInterface.bulkInsert("pagos", pagos, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("pagos", null, {});
  },
};
