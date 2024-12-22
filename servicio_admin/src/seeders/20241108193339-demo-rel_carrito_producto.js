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

    const relaciones = new Set(); // Usar un Set para evitar duplicados

    while (relaciones.size < 100) {
      const carrito_fk = faker.helpers.arrayElement(carritoIds);
      const producto_fk = faker.helpers.arrayElement(productIds);

      // Crear una clave única para la relación
      const claveUnica = `${carrito_fk}-${producto_fk}`;

      if (!relaciones.has(claveUnica)) {
        relaciones.add(claveUnica); // Añadir clave al Set
      }
    }

    // Verificar duplicados existentes en la base de datos
    const relacionesExistentes = await queryInterface.sequelize.query(
      `SELECT carrito_fk, producto_fk FROM rel_carrito_producto;`
    );
    const clavesExistentes = new Set(
      relacionesExistentes[0].map(
        (relacion) => `${relacion.carrito_fk}-${relacion.producto_fk}`
      )
    );

    // Filtrar las relaciones para evitar duplicados en la base de datos
    const relacionesFinales = Array.from(relaciones)
      .filter((relacion) => !clavesExistentes.has(relacion))
      .map((relacion) => {
        const [carrito_fk, producto_fk] = relacion.split("-").map(Number);
        return {
          carrito_fk,
          producto_fk,
          cantidad: faker.number.int({ min: 1, max: 5 }),
        };
      });

    return queryInterface.bulkInsert(
      "rel_carrito_producto",
      relacionesFinales,
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("rel_carrito_producto", null, {});
  },
};
