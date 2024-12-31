const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.CLIENTS_DB, // Nombre de la base de datos
  process.env.POSTGRES_USER, // Usuario de la base de datos
  process.env.POSTGRES_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DATABASE_HOST || "clients-db", // Usa la variable de entorno o el nombre del servicio en Docker
    port: process.env.DB_PORT, // Puerto de la base de datos
    dialect: "postgres",
  }
);

module.exports = sequelize;
