"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener IDs de órdenes existentes
    const ordenes = await queryInterface.sequelize.query(
      `SELECT id FROM ordenes;`
    );
    const ordenesIds = ordenes[0].map((orden) => orden.id);

    const relaciones = [];

    for (let i = 0; i < 100; i++) {
      const relacion = {
        orden_fk: faker.helpers.arrayElement(ordenesIds),
        producto_fk: faker.number.int({ min: 1, max: 110 }), // IDs de productos entre 1 y 50
        cantidad: faker.number.int({ min: 1, max: 5 }),
      };

      relaciones.push(relacion);
    }

    return queryInterface.bulkInsert("rel_orden_producto", relaciones, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("rel_orden_producto", null, {});
  },
};
