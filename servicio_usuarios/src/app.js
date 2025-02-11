const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();
const { sequelize } = require("./models");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const usuarioRoutes = require("./api/routes/usuarioRoutes");
const authRoutes = require("./api/routes/authRoutes");
const perfilRoutes = require("./api/routes/perfilRoutes.js");
const direccionRoutes = require("./api/routes/direccionRoutes");
require("./grpcServer.js");
const { connectConsumer } = require("./kafka/kafkaConsumer");
const { connectProducer } = require("./kafka/kafkaProducer");

// Configuración de CORS para permitir todas las solicitudes (solo para desarrollo, en producción CAMBIAR)
app.use(cors());

// Middleware básico
app.use(express.json());

app.use("/api", usuarioRoutes);
app.use("/api", authRoutes);
app.use("/api", perfilRoutes);
app.use("/api", direccionRoutes);

app.get("/", (req, res) => {
  res.send("¡Servicio Usuarios funcionando!");
});

// Ruta para la documentación de Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servidor escuchando en el puerto especificado
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  await connectProducer();
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
