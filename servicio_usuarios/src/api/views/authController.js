// authController.js
const Usuario = require("../../models/Usuario");
const Direccion = require("../../models/Direccion");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { enviarEventoKafka } = require("../../kafka/kafkaProducer");
const redisClient = require("../../config/redisClient");

/* ============================
   LOGIN CON 2FA (Paso 1)
   ============================ */
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar código 2FA (6 dígitos)
    const twoFactorCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // Almacenar el código en Redis con expiración de 300 segundos (5 minutos)
    await redisClient.setEx(`2fa:${usuario.id}`, 300, twoFactorCode);

    // Enviar evento a Kafka para que se envíe el código 2FA por correo
    await enviarEventoKafka(
      "email-verification", // O puedes usar otro tópico específico para 2FA
      "ENVIAR_CODIGO_2FA",
      {
        email: usuario.email,
        code: twoFactorCode,
        nombre: usuario.nombre,
      }
    );

    // Responder indicando que se ha enviado el código 2FA.
    res.status(200).json({
      message:
        "Código de autenticación enviado. Por favor, ingresa el código recibido para completar el login.",
      userId: usuario.id,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

/* ============================
   VERIFICACIÓN DEL CÓDIGO 2FA (Paso 2)
   ============================ */
const verify2fa = async (req, res) => {
  // Se espera recibir { userId, code } en el body
  const { userId, code } = req.body;
  if (!userId || !code) {
    return res.status(400).json({ message: "Faltan parámetros" });
  }
  try {
    // Obtener el código almacenado en Redis para este usuario
    const storedCode = await redisClient.get(`2fa:${userId}`);
    if (!storedCode) {
      return res
        .status(400)
        .json({ message: "Código no encontrado o expirado" });
    }
    // Verificar que el código coincida
    if (storedCode !== code) {
      return res.status(400).json({ message: "Código incorrecto" });
    }
    // Si el código es correcto, eliminarlo de Redis y generar el token JWT definitivo.
    await redisClient.del(`2fa:${userId}`);

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Generar token JWT (por ejemplo, con 1 hora de expiración)
    const token = jwt.sign(
      { userId: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        esta_verificado: usuario.esta_verificado,
      },
    });
  } catch (error) {
    console.error("Error al verificar 2FA:", error);
    res
      .status(500)
      .json({ message: "Error al verificar autenticación de dos factores" });
  }
};

const register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  try {
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }
    const newUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
    });
    // Generar token de verificación para la cuenta (si es que se requiere)
    const verificationToken = jwt.sign(
      { userId: newUsuario.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    await enviarEventoKafka(
      "email-verification",
      "ENVIAR_CORREO_VERIFICACION",
      {
        email: newUsuario.email,
        token: verificationToken,
        nombre: newUsuario.nombre,
      }
    );
    res.status(201).json({
      message:
        "Usuario registrado exitosamente. Revisa tu correo para verificar la cuenta",
      user: { id: newUsuario.id, nombre: newUsuario.nombre },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const { userId } = req.user;
    const usuario = await Usuario.findByPk(userId, {
      attributes: [
        "id",
        "nombre",
        "apellido",
        "email",
        "puntos_descuento",
        "rol",
      ],
      include: [
        {
          model: Direccion,
          as: "direcciones",
          attributes: [
            "id",
            "direccion",
            "ciudad",
            "departamento",
            "codigo_postal",
            "pais",
            "info_adicional",
          ],
        },
      ],
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error en getMe:", error);
    res.status(500).json({
      message: "Error al obtener datos del usuario",
      error: error.message,
    });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    usuario.esta_verificado = true;
    await usuario.save();
    res.status(200).json({ message: "Usuario verificado exitosamente" });
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};

const solicitarResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar token único para restablecimiento de contraseña (expira en 1 hora)
    const resetToken = jwt.sign(
      { userId: usuario.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Enviar evento a Kafka para que se envíe el email con el link de restablecimiento
    await enviarEventoKafka("email-verification", "ENVIAR_RESET_PASSWORD", {
      email: usuario.email,
      token: resetToken,
      nombre: usuario.nombre,
    });

    res.status(200).json({
      message:
        "Se ha enviado un correo con instrucciones para restablecer tu contraseña.",
    });
  } catch (error) {
    console.error("Error en solicitarResetPassword:", error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const usuario = await Usuario.findByPk(decoded.userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Asignar la nueva contraseña directamente (Sequelize la encriptará en `beforeSave`)
    usuario.password = newPassword;
    await usuario.save();

    res.status(200).json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};

module.exports = {
  login,
  verify2fa,
  register,
  getMe,
  verifyUser,
  solicitarResetPassword,
  resetPassword,
};
