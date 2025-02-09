const { Kafka } = require("kafkajs");
const {
  Inventario,
  Producto,
  Carrito,
  REL_CarritoProducto,
} = require("../models");

const kafka = new Kafka({
  clientId: "admins-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "admins-service-group" });

async function connectConsumer() {
  await consumer.connect();
  console.log("Kafka Consumer (admins-service) conectado");

  // Suscribirnos al tópico donde se publican eventos de puntos de venta
  await consumer.subscribe({
    topic: "puntos-de-venta-events",
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "admins-events",
    fromBeginning: false,
  });

  // Escuchar mensajes
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const msgValue = message.value.toString();
        const event = JSON.parse(msgValue);
        console.log("Evento recibido en Admin:", event);

        // Dependiendo del eventType, realizamos acciones
        if (event.eventType === "PUNTO_DE_VENTA_ELIMINADO") {
          await handlePuntoDeVentaEliminado(event.payload);
        } else if (event.eventType === "DESCONTAR_INVENTARIO") {
          await handleDescontarInventario(event.payload);
        } else if (event.eventType === "LIMPIAR_CARRITO") {
          await handleLimpiarCarrito(event.payload);
        }
      } catch (error) {
        console.error("Error procesando mensaje en Admin:", error);
        // Aquí podrías implementar lógica de reintento o DLQ (Dead Letter Queue).
      }
    },
  });
}

/**
 * Función que maneja la lógica de "PUNTO_DE_VENTA_ELIMINADO"
 */
async function handlePuntoDeVentaEliminado(payload) {
  const { id } = payload; // ID del punto de venta
  console.log(
    `Iniciando proceso de eliminación en Admin para punto_venta_id=${id}`
  );

  try {
    // 1. Obtén todos los inventarios de ese punto de venta
    const inventarios = await Inventario.findAll({
      where: { punto_venta_fk: id },
    });

    // 2. Recopila los IDs de producto únicos
    const productIds = [...new Set(inventarios.map((inv) => inv.producto_fk))];

    // 3. Elimina los inventarios para ese punto de venta
    await Inventario.destroy({ where: { punto_venta_fk: id } });

    // 4. Verifica productos huérfanos
    for (const productId of productIds) {
      // Contar cuántos inventarios existen aún para ese productId
      const count = await Inventario.count({
        where: { producto_fk: productId },
      });
      if (count === 0) {
        // Eliminar el producto que ya no se vende en ningún lado
        await Producto.destroy({ where: { id: productId } });
        console.log(`Producto ${productId} eliminado por quedar huérfano`);
      }
    }

    console.log(
      `Inventarios y productos huérfanos (si existían) eliminados para el punto_venta_id=${id}`
    );
  } catch (error) {
    console.error("Error eliminando en Admin:", error);
    // Podrías relanzar el error para que Kafka reintente
    throw error;
  }
}

async function handleDescontarInventario({ puntos_venta }) {
  // puntos_venta: array de objetos { punto_venta_fk, items }
  for (const grupo of puntos_venta) {
    const { punto_venta_fk, items } = grupo;
    for (const item of items) {
      const { producto_fk, cantidad } = item;

      const inv = await Inventario.findOne({
        where: { producto_fk, punto_venta_fk },
      });

      if (!inv) {
        throw new Error(
          `No se encontró inventario para producto_fk=${producto_fk} en PV=${punto_venta_fk}`
        );
      }

      if (inv.cantidad < cantidad) {
        throw new Error(
          `Inventario insuficiente para producto_fk=${producto_fk} en PV=${punto_venta_fk}. Actual=${inv.cantidad}, requerido=${cantidad}`
        );
      }

      inv.cantidad -= cantidad;
      await inv.save();
      console.log(
        `Inventario actualizado para producto_fk=${producto_fk} en PV=${punto_venta_fk}: nueva cantidad=${inv.cantidad}`
      );
    }
  }
}

async function handleLimpiarCarrito({ usuario_fk }) {
  // 1) Buscar el carrito del usuario
  const carrito = await Carrito.findOne({ where: { usuario_fk } });
  if (!carrito) {
    console.log(
      `No hay carrito para usuario_fk=${usuario_fk}, nada que limpiar`
    );
    return;
  }

  // 2) Borrar productos en REL_CarritoProducto
  await REL_CarritoProducto.destroy({
    where: { carrito_fk: carrito.id },
  });

  console.log(
    `Carrito ${carrito.id} (usuario_fk=${usuario_fk}) limpiado exitosamente`
  );
}

module.exports = {
  connectConsumer,
};
