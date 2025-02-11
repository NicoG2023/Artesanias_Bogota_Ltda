const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client HOST", process.env.REDIS_HOST || "redis");
  console.error("Redis Client PORT", process.env.REDIS_PORT || 6379);
  console.error("Redis Client INFORMATION", redisClient);
  console.error("Redis Client Error", err);
});

// Conecta el cliente (en versiones recientes del paquete redis, connect() retorna una promesa)
redisClient.connect();

module.exports = redisClient;
