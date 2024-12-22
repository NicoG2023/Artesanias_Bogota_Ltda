"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("productos", "rating", {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("productos", "rating");
  },
};
