const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Orden = require("./Orden");

const REL_Orden_Producto = sequelize.define(
  "REL_Orden_Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orden_fk: {
      type: DataTypes.INTEGER,
      references: {
        model: Orden,
        key: "id",
      },
    },
    producto_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },
  },
  {
    tableName: "rel_orden_producto",
    timestamps: false,
  }
);

module.exports = REL_Orden_Producto;
