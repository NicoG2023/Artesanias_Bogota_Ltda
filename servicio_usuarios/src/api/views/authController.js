const Usuario = require("../../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

    // Generar token JWT
    const token = jwt.sign(
      { userId: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Responder con el token y datos básicos del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
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
    res
      .status(201)
      .json({
        message: "Usuario registrado exitosamente",
        user: { id: newUsuario.id, nombre: newUsuario.nombre },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
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
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error en getMe:", error);
    res.status(500).json({ message: "Error al obtener datos del usuario" });
  }
};

module.exports = { login, register, getMe };
