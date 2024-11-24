const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require("./models");
const cors = require("cors");
const productoRoutes = require("./api/routes/productoRoutes");

// Configuración de CORS para permitir todas las solicitudes (solo para desarrollo, en producción CAMBIAR)
app.use(cors());

// Middleware básico
app.use(express.json());

// Rutas
app.use("/api", productoRoutes);

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
