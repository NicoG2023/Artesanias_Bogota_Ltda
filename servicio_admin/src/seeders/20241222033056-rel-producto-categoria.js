"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener productos y categorías existentes
    const productos = await queryInterface.sequelize.query(
      `SELECT id FROM productos;`
    );
    const categorias = await queryInterface.sequelize.query(
      `SELECT id FROM categorias;`
    );

    const productoIds = productos[0].map((producto) => producto.id);
    const categoriaIds = categorias[0].map((categoria) => categoria.id);

    const relaciones = new Set(); // Usar un Set para evitar duplicados

    // Generar relaciones únicas entre producto y categoría
    while (relaciones.size < 100) {
      const producto_fk = faker.helpers.arrayElement(productoIds);
      const categoria_fk = faker.helpers.arrayElement(categoriaIds);

      // Crear una clave única para la relación
      const claveUnica = `${producto_fk}-${categoria_fk}`;

      if (!relaciones.has(claveUnica)) {
        relaciones.add(claveUnica); // Añadir clave única al Set
      }
    }

    // Convertir el Set en un array de relaciones únicas
    const relacionesFinales = Array.from(relaciones).map((relacion) => {
      const [producto_fk, categoria_fk] = relacion.split("-").map(Number);
      return {
        producto_fk,
        categoria_fk,
      };
    });

    return queryInterface.bulkInsert(
      "rel_producto_categoria",
      relacionesFinales,
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("rel_producto_categoria", null, {});
  },
};
