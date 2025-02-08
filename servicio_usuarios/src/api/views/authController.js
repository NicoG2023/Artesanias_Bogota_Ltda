const Usuario = require("../../models/Usuario");
const Direccion = require("../../models/Direccion");
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
    res.status(201).json({
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
      include: [
        {
          model: Direccion, // Asegúrate de importar el modelo Direccion
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

const verifyCurrentPassword = async (req, res) => {
  const { currentPassword } = req.body;
  const { userId } = req.user; // Asumiendo que tienes el userId del middleware de autenticación

  try {
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ 
        message: "Usuario no encontrado" 
      });
    }

    // Verificar la contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "La contraseña actual es incorrecta" 
      });
    }

    // Si la contraseña es correcta
    return res.status(200).json({ 
      message: "Contraseña verificada correctamente",
      verified: true
    });

  } catch (error) {
    console.error("Error al verificar la contraseña:", error);
    return res.status(500).json({ 
      message: "Error al verificar la contraseña",
      error: error.message 
    });
  }
};

module.exports = { login, register, getMe, verifyCurrentPassword };
