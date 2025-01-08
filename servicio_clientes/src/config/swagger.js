const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación API de Clientes",
      version: "1.0.0",
      description:
        "Documentación de la API para gestión de Ordenes, Puntos de Venta y Pagos",
    },
    servers: [
      {
        url: "http://localhost:3003", // Cambiar si usas otro entorno
        description: "Servicio de Clientes",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./api/routes/ordenRoutes.js"], // Cambia esto según la estructura de tu proyecto
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
