const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "users-service",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Kafka Producer (users-service) conectado");
}

/**
 * Envía un evento a Kafka. Si ocurre un error (por ejemplo, producer desconectado),
 * intenta reconectar y reenviar el mensaje.
 *
 * @param {string} topic - Tópico en el que se enviará el evento.
 * @param {string} eventType - Tipo de evento.
 * @param {Object} payload - Datos del evento.
 * @param {number} [attempt=0] - Número de intento actual (para control de reintentos).
 */
async function enviarEventoKafka(topic, eventType, payload, attempt = 0) {
  const MAX_ATTEMPTS = 5; // Máximo de reintentos antes de abandonar
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify({ eventType, payload }) }],
    });
    console.log(`Evento ${eventType} enviado a Kafka en ${topic}`);
  } catch (error) {
    console.error(`Error enviando evento ${eventType} a Kafka:`, error);
    if (attempt < MAX_ATTEMPTS) {
      console.log(
        `Reintentando envío del evento ${eventType} (intento ${attempt + 1})`
      );
      // Intentamos reconectar el producer en caso de que esté desconectado
      try {
        await producer.connect();
      } catch (connectError) {
        console.error("Error al reconectar el producer:", connectError);
      }
      // Espera de forma exponencial (por ejemplo, 1 segundo * (intento + 1))
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      // Se vuelve a llamar recursivamente la función de envío incrementando el contador de intentos
      return enviarEventoKafka(topic, eventType, payload, attempt + 1);
    } else {
      console.error(
        `Máximo de reintentos alcanzado para el evento ${eventType}.`
      );
      // Aquí podrías guardar en un log o notificar de otra forma el fallo.
    }
  }
}

module.exports = { connectProducer, enviarEventoKafka };
