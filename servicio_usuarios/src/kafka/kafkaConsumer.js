const { Kafka } = require("kafkajs");
const { Usuario } = require("../models");

const kafka = new Kafka({
  clientId: "users-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "users-service-group" });

async function connectConsumer() {
  await consumer.connect();
  console.log("Kafka Consumer (users-service) conectado");

  await consumer.subscribe({
    topic: "usuarios-events",
    fromBeginning: false,
  });

  //Escuchar mensajes
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const msgValue = message.value.toString();
        const event = JSON.parse(msgValue);
        console.log("Evento recibido en Usuarios:", event);
        if (event.eventType === "ACTUALIZAR_PUNTOS_USUARIO") {
          await handleActualizarPuntosUsuario(event.payload);
        } else if (event.eventType === "VINCULAR_USUARIO") {
          await handleVincularUsuario(event.payload);
        }
      } catch (error) {
        console.error("Error procesando mensaje en Usuarios:", error);
      }
    },
  });
}

async function handleActualizarPuntosUsuario({
  usuario_fk,
  discountPercentage,
  total,
}) {
  // 1) Buscar al usuario
  const usuario = await Usuario.findByPk(usuario_fk);
  if (!usuario) {
    console.log(
      `Usuario con ID=${usuario_fk} no encontrado, no se actualizan puntos`
    );
    return;
  }

  // 2) Lógica de puntos
  // "Si discountPercentage = 0 y total > 70000 => +10 puntos;
  //  si discountPercentage != 0 => reset a 0"

  if (discountPercentage === 0 && total > 70000) {
    // Sumar 10 puntos
    const nuevosPuntos = (usuario.puntos_descuento || 0) + 10;
    usuario.puntos_descuento = nuevosPuntos;
    await usuario.save();
    console.log(
      `Puntos de descuento para usuario ${usuario_fk} incrementados a ${nuevosPuntos}`
    );
  } else if (discountPercentage !== 0) {
    // Reset a 0
    usuario.puntos_descuento = 0;
    await usuario.save();
    console.log(
      `Puntos de descuento para usuario ${usuario_fk} reseteados a 0`
    );
  } else {
    // discountPercentage = 0 y total <= 70000 => no hacemos nada
    console.log(
      `Usuario ${usuario_fk} sin cambio de puntos (discount=0, total <= 70000)`
    );
  }
}

async function handleVincularUsuario({ email }) {
  if (!email) {
    console.error("No se proporcionó email en el payload de VINCULAR_USUARIO");
    return;
  }

  // Buscar usuario por email
  let usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    // Si no existe, crearlo
    // Se genera una contraseña aleatoria (en producción usa un método más robusto)
    const randomPassword = Math.random().toString(36).slice(-8);
    usuario = await Usuario.create({
      email,
      password: randomPassword, // se encriptará automáticamente mediante el hook beforeSave
      rol: "cliente",
    });
    console.log(`Se creó un nuevo usuario: ${usuario.id} para email: ${email}`);
  } else {
    console.log(`Usuario ya existente: ${usuario.id} para email: ${email}`);
  }

  // Aquí podrías, por ejemplo, publicar un evento de confirmación o actualizar metadata si fuera necesario.
}

module.exports = {
  connectConsumer,
};
