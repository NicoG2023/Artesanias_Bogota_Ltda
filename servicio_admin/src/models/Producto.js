const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      get() {
        const rawValue = this.getDataValue("precio");
        return new Intl.NumberFormat("es-CO").format(rawValue / 100);
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    es_activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    talla: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
      defaultValue: 0,
    },
    stripe_product_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripe_price_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "productos",
    timestamps: true,
    indexes: [
      { fields: ["nombre"] },
      { fields: ["sku"] },
      { fields: ["color"] },
      { fields: ["talla"] },
    ],
    hooks: {
      beforeValidate: async (producto) => {
        if (
          !producto.sku ||
          producto.sku === null ||
          producto.sku === undefined
        ) {
          producto.sku = generarSKU(producto);
          console.log("SKU generado:", producto.sku);
        }
      },
      beforeUpdate: async (producto) => {
        if (
          !producto.sku ||
          producto.sku === null ||
          producto.sku === undefined
        ) {
          producto.sku = generarSKU(producto);
          console.log("SKU generado:", producto.sku);
        }
      },
    },
  }
);

function generarSKU(producto) {
  const color = producto.color
    ? `-${producto.color.substring(0, 3).toUpperCase()}`
    : "";
  const talla = producto.talla ? `-${producto.talla.toUpperCase()}` : "";
  const uniqueId = Date.now().toString().slice(-4);
  return `PROD${color}${talla}-${uniqueId}`;
}

module.exports = {
  Producto,
  generarSKU,
};
