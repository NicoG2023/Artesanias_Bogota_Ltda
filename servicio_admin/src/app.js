const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require("./models");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const productoRoutes = require("./api/routes/productoRoutes");
const carritoRoutes = require("./api/routes/carritoRoutes");
const inventarioRoutes = require("./api/routes/inventarioRoutes");
const categoriaRoutes = require("./api/routes/categoriaRoutes");
const recomendacionesRoutes = require("./api/routes/recomendacionesRoutes");
require("./grpc/grpcServer");
require("./grpc/puntoVentaClientGrpc");
const { connectConsumer } = require("./kafka/kafkaConsumer");

// Configuración de CORS para permitir todas las solicitudes (solo para desarrollo, en producción CAMBIAR)
app.use(cors());

// Middleware básico
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rutas
app.use("/api", productoRoutes);
app.use("/api", carritoRoutes);
app.use("/api", inventarioRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", recomendacionesRoutes);

// Ruta para la documentación de Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servidor escuchando en el puerto especificado
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  await connectConsumer();
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
