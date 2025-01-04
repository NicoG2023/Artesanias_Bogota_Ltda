const { Usuario } = require("../../models");

// Crear un usuario
const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, puntos_descuento, rol, es_activo } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios (nombre, apellido, email, password)" });
    }

    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      puntos_descuento: puntos_descuento || 0,  // Valor por defecto en caso de no especificarse
      rol: rol || "cliente",
      es_activo: es_activo !== undefined ? es_activo : true,
    });

    // Excluir la contraseña antes de devolver la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.error("Error al crear el usuario:", error);

    // Mostrar detalles del error
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`Validation error in field: ${err.path}, message: ${err.message}`);
      });
    }

    res.status(400).json({ message: "Error al crear el usuario: " + error.message });
  }
};

// Obtener todos los usuarios
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password"] }, // Excluir contraseña
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(400).json({ message: "Error al obtener los usuarios: " + error.message });
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({
      where: { id },
      attributes: { exclude: ["password"] }, // Excluir contraseña
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(400).json({ message: "Error al obtener el usuario: " + error.message });
  }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await usuario.update(updatedData);
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(400).json({ message: "Error al actualizar el usuario: " + error.message });
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await usuario.destroy();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(400).json({ message: "Error al eliminar el usuario: " + error.message });
  }
};

module.exports = {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};
