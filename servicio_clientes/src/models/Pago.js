const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pago = sequelize.define(
  "Pago",
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
    vendedor_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    intencion_pago_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metodo_pago_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto_transaccion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    moneda_transaccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_pago: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pagos",
    timestamps: false,
  }
);

module.exports = Pago;
