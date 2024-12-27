"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener nombres existentes de la tabla categorias
    const categoriasExistentes = await queryInterface.sequelize.query(
      `SELECT nombre FROM categorias;`
    );
    const nombresExistentes = categoriasExistentes[0].map((cat) => cat.nombre);

    const categorias = [];

    for (let i = 0; i < 10; i++) {
      const nombre = faker.commerce.department();

      // Solo agrega nombres únicos
      if (!nombresExistentes.includes(nombre)) {
        categorias.push({ nombre });
        nombresExistentes.push(nombre); // Evita duplicados en la iteración
      }
    }

    return queryInterface.bulkInsert("categorias", categorias, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("categorias", null, {});
  },
};
