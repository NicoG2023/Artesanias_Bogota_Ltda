const sequelize = require("../config/database");

const { Producto } = require("./Producto");
const Categoria = require("./Categoria");
const Carrito = require("./Carrito");
const REL_CarritoProducto = require("./REL_Carrito_Producto");
const Inventario = require("./Inventario");
const REL_ProductoCategoria = require("./REL_Producto_Categoria");

// Relación Producto - Inventario
Producto.hasMany(Inventario, {
  foreignKey: "producto_fk",
  as: "inventario",
});

Inventario.belongsTo(Producto, {
  foreignKey: "producto_fk",
  as: "producto",
});

// Relación Producto - Categoria (Muchos a Muchos)
Producto.belongsToMany(Categoria, {
  through: REL_ProductoCategoria, // Tabla intermedia
  foreignKey: "producto_fk",
  otherKey: "categoria_fk",
  as: "categorias", // Alias para acceder a las categorías del producto
});

Categoria.belongsToMany(Producto, {
  through: REL_ProductoCategoria, // Tabla intermedia
  foreignKey: "categoria_fk",
  otherKey: "producto_fk",
  as: "productos", // Alias para acceder a los productos de la categoría
});

// Relación Carrito - Producto (Muchos a Muchos)
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
  REL_ProductoCategoria,
  Inventario,
  sequelize,
};
