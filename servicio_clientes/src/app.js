const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require("./models");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const ordenesRoutes = require("./api/routes/ordenRoutes");
const puntoVentaRoutes = require("./api/routes/puntoVentaRoutes");
require("./grpc/userClientGrpc");
require("./grpc/productClientGrpc");
require("./grpc/grpcServer");
const { connectProducer } = require("./kafka/kafkaProducer");

// Configuración de CORS para permitir todas las solicitudes (solo para desarrollo, en producción CAMBIAR)s
app.use(cors());

// Middleware básico
app.use(express.json());

app.use("/api", ordenesRoutes);
app.use("/api", puntoVentaRoutes);

// Ruta de ejemplo
app.get("/", (req, res) => {
  res.send("¡Servicio funcionando!");
});

// Ruta para la documentación de Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sincronización y autenticación con la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida con la base de datos.");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Sincronización de modelos completada");
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err);
  });

// Servidor escuchando en el puerto especificado
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);

  await connectProducer();
});
