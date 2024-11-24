const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios",
      version: "1.0.0",
      description: "Documentación de la API para servicio de usuarios",
    },
    servers: [
      {
        url: "http://localhost:3001", // Cambia esto según tu entorno
        description: "Servidor local",
      },
    ],
  },
  apis: ["../api/routes/*.js"], // Ruta a los archivos donde defines tus endpoints
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
