"use strict";

const { faker } = require("@faker-js/faker");
const { generarSKU } = require("../models/Producto");
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = "imagenes-artesanias";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const productos = new Set(); // Usar un Set para garantizar SKUs únicos

    while (productos.size < 60) {
      const producto = {
        nombre: faker.commerce.productName(),
        sku: "", // Se generará más adelante
        precio: parseFloat(
          faker.commerce.price({ min: 2000, max: 500000, dec: 0 })
        ),
        descripcion: faker.commerce.productDescription(),
        imagen: `https://${storageAccountName}.blob.core.windows.net/${containerName}/default-product.webp`,
        es_activo: true,
        color: faker.color.human(),
        talla: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
        rating: parseFloat(faker.helpers.arrayElement([1, 2, 3, 4, 5])),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Generar SKU utilizando tu función
      const sku = generarSKU(producto);
      if (![...productos].some((p) => p.sku === sku)) {
        producto.sku = sku;
        productos.add(producto);
      }
    }

    return queryInterface.bulkInsert("productos", [...productos], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("productos", null, {});
  },
};
