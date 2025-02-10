// kafkaConsumer.js
const { Kafka } = require("kafkajs");
const { Usuario } = require("../models");
const nodemailer = require("nodemailer");

// Función para enviar correo usando Gmail
async function enviarCorreoGmail(email, subject, htmlContent) {
  // Configura el transporter con Gmail
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Ej: "tu-cuenta@gmail.com"
      pass: process.env.EMAIL_PASS, // Contraseña de aplicación generada
    },
  });

  // Opciones del correo
  let mailOptions = {
    from: `"Bogotá Artesanías Ltda." <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  // Envía el correo
  let info = await transporter.sendMail(mailOptions);
  console.log("Mensaje enviado: %s", info.messageId);
}

// Inicialización del cliente Kafka
const kafka = new Kafka({
  clientId: "users-service",
  brokers: ["kafka:9092"],
});
const consumer = kafka.consumer({ groupId: "users-service-group" });

async function connectConsumer() {
  await consumer.connect();
  console.log("Kafka Consumer (users-service) conectado");

  // Suscribirse a los tópicos que vas a utilizar
  await consumer.subscribe({
    topic: "usuarios-events",
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "email-verification",
    fromBeginning: false,
  });

  // Escuchar mensajes
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
        } else if (event.eventType === "ENVIAR_CORREO_VERIFICACION") {
          await handleEnviarCorreoVerificacion(event.payload);
        } else if (event.eventType === "ENVIAR_CODIGO_2FA") {
          await handleEnviarCodigo2FA(event.payload);
        }
      } catch (error) {
        console.error("Error procesando mensaje en Usuarios:", error);
      }
    },
  });
}

// Función existente para actualizar puntos (sin cambios)
async function handleActualizarPuntosUsuario({
  usuario_fk,
  discountPercentage,
  total,
}) {
  const usuario = await Usuario.findByPk(usuario_fk);
  if (!usuario) {
    console.log(
      `Usuario con ID=${usuario_fk} no encontrado, no se actualizan puntos`
    );
    return;
  }
  if (discountPercentage === 0 && total > 70000) {
    const nuevosPuntos = (usuario.puntos_descuento || 0) + 10;
    usuario.puntos_descuento = nuevosPuntos;
    await usuario.save();
    console.log(
      `Puntos de descuento para usuario ${usuario_fk} incrementados a ${nuevosPuntos}`
    );
  } else if (discountPercentage !== 0) {
    usuario.puntos_descuento = 0;
    await usuario.save();
    console.log(
      `Puntos de descuento para usuario ${usuario_fk} reseteados a 0`
    );
  } else {
    console.log(
      `Usuario ${usuario_fk} sin cambio de puntos (discount=0, total <= 70000)`
    );
  }
}

// Función existente para vincular usuario (sin cambios)
async function handleVincularUsuario({ email }) {
  if (!email) {
    console.error("No se proporcionó email en el payload de VINCULAR_USUARIO");
    return;
  }
  let usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    const randomPassword = Math.random().toString(36).slice(-8);
    usuario = await Usuario.create({
      email,
      password: randomPassword,
      rol: "cliente",
    });
    console.log(`Se creó un nuevo usuario: ${usuario.id} para email: ${email}`);
  } else {
    console.log(`Usuario ya existente: ${usuario.id} para email: ${email}`);
  }
}

// Función existente para enviar correo de verificación
async function handleEnviarCorreoVerificacion({ email, token, nombre }) {
  console.log("Entra a handleEnviarCorreoVerificacion con Gmail");
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationUrl = `${FRONTEND_URL}/verify?token=${token}`;
  const subject = "Verifica tu cuenta";
  const htmlContent = `<p>Hola ${nombre},</p>
                       <p>Por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p>
                       <a href="${verificationUrl}">Verificar mi cuenta</a>`;
  try {
    await enviarCorreoGmail(email, subject, htmlContent);
  } catch (error) {
    console.error("Error al enviar correo de verificación con Gmail:", error);
  }
}

// NUEVA: Función para enviar el código 2FA al correo del usuario
async function handleEnviarCodigo2FA({ email, code, nombre }) {
  console.log("Entra a handleEnviarCodigo2FA con Gmail");
  const subject = "Tu código de autenticación";
  const htmlContent = `<p>Hola ${nombre},</p>
                       <p>Tu código de autenticación es: <strong>${code}</strong></p>
                       <p>Ingresa este código en la aplicación para completar tu inicio de sesión.</p>`;
  try {
    await enviarCorreoGmail(email, subject, htmlContent);
  } catch (error) {
    console.error("Error al enviar código 2FA con Gmail:", error);
  }
}

module.exports = {
  connectConsumer,
};
