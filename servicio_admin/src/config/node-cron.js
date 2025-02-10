const redisClient = require("./redisClient");
const cron = require("node-cron");
const {
  getRecomendacionProductos,
} = require("../api/views/sistemaRecomendacionController");

// 🔹 Ejecuta la actualización todos los días a las 8:00 PM (hora de Bogotá - UTC-5)
cron.schedule("0 20 * * *", async () => {
  console.log("⏳ Actualizando caché de recomendaciones...");
  try {
    const users = [1, 2, 3, 4, 5]; // 🔹 IDs de usuarios a actualizar (puedes cargar dinámicamente)

    for (const userId of users) {
      const req = { params: { userId } };
      await getRecomendacionProductos(req, {
        json: (data) =>
          console.log(`✅ Caché actualizada para usuario ${userId}`),
      });
    }
  } catch (error) {
    console.error(
      "❌ Error actualizando caché de recomendaciones:",
      error.message
    );
  }
});
