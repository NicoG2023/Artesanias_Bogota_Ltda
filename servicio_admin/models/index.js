const sequelize = require("../config/database");

const { Producto } = require("./Producto");
const Categoria = require("./Categoria");
const Carrito = require("./Carrito");
const REL_CarritoProducto = require("./REL_Carrito_Producto");
const Inventario = require("./Inventario");

Producto.hasMany(Inventario, {
  foreignKey: "producto_fk",
  as: "inventario",
});

Inventario.belongsTo(Producto, {
  foreignKey: "producto_fk",
  as: "producto",
});

Producto.belongsTo(Categoria, {
  foreignKey: "categoria_fk",
  as: "categoria", // Alias para acceder a la categoría desde Producto
});

Carrito.belongsToMany(Producto, {
  through: REL_CarritoProducto,
  foreignKey: "carrito_fk",
  otherKey: "producto_fk",
  as: "productos",
});

Producto.belongsToMany(Carrito, {
  through: REL_CarritoProducto,
  foreignKey: "producto_fk",
  otherKey: "carrito_fk",
  as: "carritos", // Alias para acceder a los carritos que contienen el producto
});

module.exports = {
  Producto,
  Categoria,
  Carrito,
  REL_CarritoProducto,
  Inventario,
  sequelize,
};
