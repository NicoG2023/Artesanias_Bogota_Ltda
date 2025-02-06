const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Direccion = sequelize.define(
  "Direccion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios", // Nombre de la tabla de usuarios en la BD
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    // Campo único que guarda la dirección completa (calle, número, y otros detalles)
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Dirección completa (por ejemplo: 'Calle 123 Bis')",
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Departamento en Colombia",
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Colombia",
    },
    info_adicional: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Información adicional sobre la dirección",
    },
  },
  {
    tableName: "direcciones",
    timestamps: false,
  }
);

module.exports = Direccion;
