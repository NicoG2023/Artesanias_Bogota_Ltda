const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PuntoVenta = sequelize.define(
  "PuntoVenta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("fisico", "online"),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true, // Solo necesario para puntos físicos
    },
  },
  {
    tableName: "puntos_venta",
    timestamps: false,
  }
);

module.exports = PuntoVenta;
