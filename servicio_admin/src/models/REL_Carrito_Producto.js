const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Carrito = require("./Carrito");
const Producto = require("./Producto");

const REL_CarritoProducto = sequelize.define(
  "REL_CarritoProducto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    carrito_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Carrito,
        key: "id",
      },
    },
    producto_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Producto,
        key: "id",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Cantidad predeterminada de 1 si no se especifica
      validate: {
        min: 1, // Evita cantidades menores a 1
      },
    },
  },
  {
    tableName: "rel_carrito_producto",
    timestamps: false,
  }
);

module.exports = REL_CarritoProducto;
