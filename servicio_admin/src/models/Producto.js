const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Categoria = require("./Categoria"); // Importar el modelo Categoria para la referencia

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
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
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
    categoria_fk: {
      type: DataTypes.INTEGER,
      references: {
        model: Categoria, // Usamos el modelo Categoria en lugar de "categorias"
        key: "id",
      },
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    talla: {
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
      beforeCreate: async (producto) => {
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
  const categoria = producto.categoria_fk
    ? `CAT${producto.categoria_fk}`
    : "GEN";
  const color = producto.color
    ? `-${producto.color.substring(0, 3).toUpperCase()}`
    : "";
  const talla = producto.talla ? `-${producto.talla.toUpperCase()}` : "";
  const uniqueId = Date.now().toString().slice(-4);
  console.log(
    "Categoria: ",
    categoria,
    "color: ",
    color,
    "talla: ",
    talla,
    "uniqueId: ",
    uniqueId
  );
  return `${categoria}${color}${talla}-${uniqueId}`;
}

module.exports = {
  Producto,
  generarSKU,
};
