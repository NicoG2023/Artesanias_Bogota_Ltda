"use strict";

const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = [];
    const password = await bcrypt.hash("contraseñaSegura123", 10);

    for (let i = 0; i < 60; i++) {
      // Generar 60 usuarios
      const nombre = faker.person.firstName();
      const apellido = faker.person.lastName();
      const email = faker.internet.email({
        firstName: nombre,
        lastName: apellido,
      });
      const puntos_descuento = faker.number.int({ min: 0, max: 500 });
      const roles = ["cliente", "admin", "staff", "superadmin"];
      const rolIndex = faker.number.int({ min: 0, max: roles.length - 1 });
      const rol = roles[rolIndex]; // Escoge un rol aleatorio de roles
      const es_activo = faker.datatype.boolean(); // Este método aún es válido

      usuarios.push({
        nombre,
        apellido,
        email,
        password,
        puntos_descuento,
        rol,
        es_activo,
      });
    }

    return queryInterface.bulkInsert("usuarios", usuarios, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("usuarios", null, {});
  },
};
