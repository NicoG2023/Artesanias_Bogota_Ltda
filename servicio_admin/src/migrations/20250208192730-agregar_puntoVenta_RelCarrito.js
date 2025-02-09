"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("rel_carrito_producto", "punto_venta_fk", {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: "producto_fk", // opcional: en MySQL indica la posición de la columna
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "producrel_carrito_productotos",
      "punto_venta_fk"
    );
  },
};
