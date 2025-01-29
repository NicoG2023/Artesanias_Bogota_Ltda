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
    indexes: [
      {
        unique: true, // Índice único compuesto
        fields: ["producto_fk", "punto_venta_fk"],
        name: "unique_producto_punto_venta",
      },
    ],
  }
);

module.exports = Inventario;
