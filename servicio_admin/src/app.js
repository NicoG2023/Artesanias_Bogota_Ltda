const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require("./models");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const productoRoutes = require("./api/routes/productoRoutes");
const categoriaRoutes = require("./api/routes/categoriaRoutes");
require("./grpcServer");
require("./puntoVentaClientGrpc");

// Configuración de CORS para permitir todas las solicitudes (solo para desarrollo, en producción CAMBIAR)
app.use(cors());

// Middleware básico
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rutas
app.use("/api", productoRoutes);
app.use("/api", categoriaRoutes);

// Ruta para la documentación de Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servidor escuchando en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida con la base de datos");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Sincronización de modelos completada");
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err);
  });
