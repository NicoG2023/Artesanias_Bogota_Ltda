const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "clients-service",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Kafka Producer (clients-service) conectado");
}

/**
 * Envía un mensaje a un tópico de Kafka.
 * @param {string} topic - Nombre del tópico (ej: "puntos-de-venta-events")
 * @param {string} key - Una key del mensaje (opcional, para particionar)
 * @param {object} message - El payload con la información
 */
async function sendMessage(topic, key, message) {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(message),
        },
      ],
    });
    console.log("Mensaje enviado a Kafka:", topic, message);
  } catch (error) {
    console.error("Error enviando mensaje a Kafka:", error);
  }
}

module.exports = {
  connectProducer,
  sendMessage,
};
