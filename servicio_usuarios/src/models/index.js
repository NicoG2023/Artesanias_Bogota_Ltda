const sequelize = require("../config/database");
const Usuario = require("./Usuario");
const Direccion = require("./Direccion");

// Un usuario puede tener muchas direcciones
Usuario.hasMany(Direccion, { foreignKey: "usuario_fk", as: "direcciones" });

// Cada dirección pertenece a un usuario
Direccion.belongsTo(Usuario, { foreignKey: "usuario_fk", as: "usuario" });

module.exports = {
  Usuario,
  Direccion,
  sequelize,
};
