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
    usuraio_fk: {
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
  },
  {
    tableName: "ordenes",
    timestamps: false,
  }
);

module.exports = Orden;
