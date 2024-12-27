const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Categoria = require("./Categoria");
const Producto = require("./Producto");

const REL_ProductoCategoria = sequelize.define(
  "REL_ProductoCategoria",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoria_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Categoria,
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
  },
  {
    tableName: "rel_producto_categoria",
    timestamps: false,
  }
);

module.exports = REL_ProductoCategoria;
