"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("direcciones", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario_fk: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios", // Asegúrate que coincida con el nombre real de la tabla de usuarios
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ciudad: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      departamento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      codigo_postal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pais: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Colombia",
      },
      info_adicional: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("direcciones");
  },
};
