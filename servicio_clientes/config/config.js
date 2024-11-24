module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.CLIENTS_DB,
    host: process.env.DATABASE_HOST || "clients-db",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
  // Puedes agregar configuraciones para 'test' y 'production' si es necesario
};
