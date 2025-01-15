"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("pagos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_fk: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cliente_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      intencion_pago_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      metodo_pago_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      monto_transaccion: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      moneda_transaccion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fecha_pago: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("pagos");
  },
};
