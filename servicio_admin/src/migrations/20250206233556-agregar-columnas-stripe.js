"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("productos", "stripe_product_id", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "rating", // opcional: en MySQL indica la posición de la columna
    });

    await queryInterface.addColumn("productos", "stripe_price_id", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "stripe_product_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("productos", "stripe_product_id");
    await queryInterface.removeColumn("productos", "stripe_price_id");
  },
};
