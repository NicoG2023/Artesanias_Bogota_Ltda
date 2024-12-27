"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rel_producto_categoria", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      producto_fk: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "productos", // Nombre de la tabla productos
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoria_fk: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categorias", // Nombre de la tabla categorias
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("rel_producto_categoria");
  },
};
