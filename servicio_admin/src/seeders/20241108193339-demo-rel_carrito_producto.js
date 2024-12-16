"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener carritos y productos existentes
    const carritos = await queryInterface.sequelize.query(
      `SELECT id FROM carrito;`
    );
    const productos = await queryInterface.sequelize.query(
      `SELECT id FROM productos;`
    );

    const carritoIds = carritos[0].map((carrito) => carrito.id);
    const productIds = productos[0].map((product) => product.id);

    const relaciones = [];

    for (let i = 0; i < 100; i++) {
      const carrito_fk = faker.helpers.arrayElement(carritoIds);
      const producto_fk = faker.helpers.arrayElement(productIds);

      const relacion = {
        carrito_fk: carrito_fk,
        producto_fk: producto_fk,
        cantidad: faker.number.int({ min: 1, max: 5 }),
      };

      relaciones.push(relacion);
    }

    return queryInterface.bulkInsert("rel_carrito_producto", relaciones, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("rel_carrito_producto", null, {});
  },
};
