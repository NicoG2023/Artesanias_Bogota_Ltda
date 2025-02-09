"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ordenes", "stripe_session_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("ordenes", "descuento_aplicado", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ordenes", "stripe_session_id");
    await queryInterface.removeColumn("ordenes", "descuento_aplicado");
  },
};
