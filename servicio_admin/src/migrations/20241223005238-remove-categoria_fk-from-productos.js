"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("productos", "categoria_fk");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("productos", "categoria_fk", {
      type: Sequelize.INTEGER,
      references: {
        model: "categorias",
        key: "id",
      },
      allowNull: false,
    });
  },
};
