const express = require("express");
const app = express();
const socketIO = require("socket.io");
const http = require("http");
const { sequelize } = require("./models");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const ordenesRoutes = require("./api/routes/ordenRoutes");
const puntoVentaRoutes = require("./api/routes/puntoVentaRoutes");
const pagosRoutes = require("./api/routes/pagosRoutes");
require("./grpc/userClientGrpc");
require("./grpc/productClientGrpc");
require("./grpc/grpcServer");
const { connectProducer } = require("./kafka/kafkaProducer");
const { stripeWebhookHandler } = require("./api/views/PagosController");

const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir todas las solicitudes (solo para desarrollo, en producción CAMBIAR)s
app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/webhook/stripe")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use("/api", ordenesRoutes);
app.use("/api", puntoVentaRoutes);
app.use("/api", pagosRoutes);
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

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
const server = http.createServer(app); // Creamos un servidor HTTP a partir de Express
const io = socketIO(server, {
  cors: {
    origin: "*", // Ajusta esto según necesites
    methods: ["GET", "POST"],
  },
});

// Hacemos io "global" para usarlo en los controladores (por ejemplo, en la simulación)
global.io = io;

// Escuchar la conexión de clientes Socket
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Unirse a una sala específica de la orden
  socket.on("joinOrderRoom", (ordenId) => {
    socket.join(`orden-${ordenId}`);
    console.log(`Socket ${socket.id} se unió a la sala orden-${ordenId}`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Iniciar el servidor
server.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  // Si necesitas conectar Kafka Producer:
  await connectProducer();
});
