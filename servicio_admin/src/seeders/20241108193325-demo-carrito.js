"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const carritos = [];

    for (let i = 0; i < 20; i++) {
      const usuario_fk = faker.number.int({ min: 1, max: 120 }); // Número entre 1 y 120

      const carrito = {
        usuario_fk: usuario_fk,
      };

      carritos.push(carrito);
    }

    return queryInterface.bulkInsert("carrito", carritos, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("carrito", null, {});
  },
};
