"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ordenes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_fk: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lugar_compra_fk: {
        type: Sequelize.INTEGER,
        references: {
          model: "puntos_venta",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pago_fk: {
        type: Sequelize.INTEGER,
        references: {
          model: "pagos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      fecha_orden: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ordenes");
  },
};
