"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Quitar la columna 'cliente_id' de la tabla 'pagos'
    await queryInterface.removeColumn("pagos", "cliente_id");

    // Agregar la columna 'vendedor_fk' a la tabla 'pagos'
    await queryInterface.addColumn("pagos", "vendedor_fk", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir: quitar la columna 'vendedor_fk'
    await queryInterface.removeColumn("pagos", "vendedor_fk");

    // Volver a agregar la columna 'cliente_id'
    await queryInterface.addColumn("pagos", "cliente_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
