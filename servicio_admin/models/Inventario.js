const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Producto = require("./Producto");

const Inventario = sequelize.define(
  "Inventario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    producto_fk: {
      type: DataTypes.INTEGER,
      references: {
        model: Producto,
        key: "id",
      },
    },
    punto_venta_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_punto_venta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "inventario",
    timestamps: false,
  }
);

module.exports = Inventario;
