"use strict";

const { faker } = require("@faker-js/faker");
const { generarSKU } = require("../models/Producto"); // Asegúrate de exportar esta función
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = "imagenes-artesanias";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener categorías existentes
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM categorias;`
    );

    const categoryIds = categories[0].map((category) => category.id);

    const productos = [];

    for (let i = 0; i < 60; i++) {
      const categoria_fk = faker.helpers.arrayElement(categoryIds);

      const producto = {
        nombre: faker.commerce.productName(),
        sku: "", // Se generará más adelante
        precio: parseFloat(
          faker.commerce.price({ min: 2000, max: 500000, dec: 0 })
        ),
        descripcion: faker.commerce.productDescription(),
        imagen: "", // Ajusta según tus necesidades
        es_activo: true,
        categoria_fk: categoria_fk,
        color: faker.color.human(),
        talla: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
        rating: parseFloat(faker.helpers.arrayElement([1, 2, 3, 4, 5])),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Generar SKU utilizando tu función
      producto.sku = generarSKU(producto);

      producto.imagen = `https://${storageAccountName}.blob.core.windows.net/${containerName}/default-product.webp`;

      productos.push(producto);
    }

    return queryInterface.bulkInsert("productos", productos, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("productos", null, {});
  },
};
