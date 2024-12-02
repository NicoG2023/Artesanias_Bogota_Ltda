const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carrito = sequelize.define(
  "Carrito",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "carrito",
    timestamps: false,
  }
);

module.exports = Carrito;
