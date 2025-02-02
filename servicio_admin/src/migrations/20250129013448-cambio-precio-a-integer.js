"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar el tipo de dato de la columna `precio` de DOUBLE a INTEGER
    await queryInterface.changeColumn("productos", "precio", {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio de tipo de dato de INTEGER a DOUBLE
    await queryInterface.changeColumn("productos", "precio", {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
    });
  },
};
