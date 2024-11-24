"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categorias = [];

    for (let i = 0; i < 10; i++) {
      categorias.push({
        nombre: faker.commerce.department(),
      });
    }

    return queryInterface.bulkInsert("categorias", categorias, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("categorias", null, {});
  },
};
