"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const puntosVenta = [];

    for (let i = 0; i < 30; i++) {
      puntosVenta.push({
        nombre: faker.company.name(),
        tipo: faker.helpers.arrayElement(["fisico", "online"]),
        direccion: faker.location.streetAddress(),
      });
    }

    return queryInterface.bulkInsert("puntos_venta", puntosVenta, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("puntos_venta", null, {});
  },
};
