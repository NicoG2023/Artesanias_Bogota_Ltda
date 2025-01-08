const sequelize = require("../config/database");

const PuntoVenta = require("./PuntoVenta");
const Orden = require("./Orden");
const Pago = require("./Pago");
const REL_Orden_Producto = require("./REL_Orden_Producto");

Orden.belongsTo(Pago, {
  foreignKey: "pago_fk",
  as: "pago",
});

Orden.belongsTo(PuntoVenta, {
  foreignKey: "lugar_compra_fk",
  as: "puntoVenta",
});

Orden.hasMany(REL_Orden_Producto, {
  foreignKey: "orden_fk",
  as: "productosOrden",
});

REL_Orden_Producto.belongsTo(Orden, {
  foreignKey: "orden_fk",
  as: "orden",
});

module.exports = {
  PuntoVenta,
  Orden,
  Pago,
  REL_Orden_Producto,
  sequelize,
};
