"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener productos existentes
    const products = await queryInterface.sequelize.query(
      `SELECT id FROM productos;`
    );

    const productIds = products[0].map((product) => product.id);

    const inventario = [];

    for (let i = 0; i < 100; i++) {
      const producto_fk = faker.helpers.arrayElement(productIds);

      const inventarioItem = {
        producto_fk: producto_fk,
        punto_venta_fk: faker.number.int({ min: 1, max: 25 }),
        nombre_punto_venta: faker.company.name(),
        cantidad: faker.number.int({ min: 0, max: 100 }),
      };

      inventario.push(inventarioItem);
    }

    return queryInterface.bulkInsert("inventario", inventario, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("inventario", null, {});
  },
};
