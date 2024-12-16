const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación API de Usuarios",
      version: "1.0.0",
      description:
        "Documentación de la API para gestión de usuarios y autenticación",
    },
    servers: [
      {
        url: "http://localhost:3001", // Cambiar si usas otro entorno
        description: "Servicio de Usuarios",
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
  apis: ["./api/routes/authRoutes.js", "./api/routes/usuarioRoutes.js"], // Cambia esto según la estructura de tu proyecto
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
