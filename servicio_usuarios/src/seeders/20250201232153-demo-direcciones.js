"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const direcciones = [];

    // Listas de ejemplo de ciudades y departamentos en Colombia.
    const ciudades = [
      "Bogotá",
      "Medellín",
      "Cali",
      "Barranquilla",
      "Cartagena",
      "Cúcuta",
      "Bucaramanga",
      "Pereira",
      "Manizales",
      "Santa Marta",
    ];
    const departamentos = [
      "Cundinamarca",
      "Antioquia",
      "Valle del Cauca",
      "Atlántico",
      "Bolívar",
      "Norte de Santander",
      "Santander",
      "Risaralda",
      "Caldas",
      "Magdalena",
    ];

    // Generamos una dirección para cada usuario (suponiendo IDs del 1 al 60)
    for (let i = 3; i <= 60; i++) {
      // Generar la dirección completa: "Calle" o "Carrera" con número y complemento
      const streetType = faker.helpers.arrayElement(["Calle", "Carrera"]);
      const streetNumber = faker.number.int({ min: 1, max: 200 });
      const streetComplement = faker.helpers.arrayElement([
        "",
        " Bis",
        " A",
        " B",
        " C",
      ]);
      const direccionCompleta = `${streetType} ${streetNumber}${streetComplement}`;

      const ciudad = faker.helpers.arrayElement(ciudades);
      const departamento = faker.helpers.arrayElement(departamentos);
      const codigo_postal = faker.number
        .int({ min: 100000, max: 999999 })
        .toString();
      const info_adicional = faker.helpers.arrayElement([
        "",
        "Apartamento 101",
        "Edificio Las Palmas",
        "Casa de esquina",
        "Conjunto residencial",
      ]);

      direcciones.push({
        usuario_fk: i, // Se asume que los IDs de usuario van del 1 al 60.
        direccion: direccionCompleta,
        ciudad,
        departamento,
        codigo_postal,
        pais: "Colombia",
        info_adicional: info_adicional || null,
      });
    }

    return queryInterface.bulkInsert("direcciones", direcciones, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("direcciones", null, {});
  },
};
