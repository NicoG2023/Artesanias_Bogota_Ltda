const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Pago = require("./Pago");
const PuntoVenta = require("./PuntoVenta");

const Orden = sequelize.define(
  "Orden",
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
    lugar_compra_fk: {
      type: DataTypes.INTEGER,
      references: {
        model: PuntoVenta,
        key: "id",
      },
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pago_fk: {
      type: DataTypes.INTEGER,
      references: {
        model: Pago,
        key: "id",
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha_orden: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    direccion_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stripe_session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descuento_aplicado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "ordenes",
    timestamps: false,
  }
);

module.exports = Orden;
