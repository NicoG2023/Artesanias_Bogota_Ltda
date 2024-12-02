const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación API de Administradores",
      version: "1.0.0",
      description:
        "Documentación de la API para gestión realizada por los administradores del sistema",
    },
    servers: [
      {
        url: "http://localhost:3002", // Cambiar si usas otro entorno
        description: "Servicio de Admins",
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
  apis: ["./api/routes/productoRoutes.js"], // Cambia esto según la estructura de tu proyecto
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
