const Usuario = require("../../models");

//Lectura de usuarios
//Leer todos los usarios
async function getAllUsuarios() {
  try {
    const usuarios = await Usuario.findAll();
    return usuarios;
  } catch (error) {
    throw new Error("Error al obtener los usuarios: " + error.message);
  }
}

//Leer un usuario por id
async function getUsuarioById(id) {
  try {
    const usuario = await Usuario.findOne({
      where: { id: id },
    });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  } catch (error) {
    throw new Error("Error al obtener el usuario: " + error.message);
  }
}

//Eliminacion de usuario
async function deleteUsuario(id) {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    await usuario.destroy();
    return { message: "Usuario eliminado correctamente" };
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
}

async function updateUser(id, updatedData) {
  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    await user.update(updatedData);
    return user;
  } catch (error) {
    console.error("Error actualizando el usuario:", error);
    throw error;
  }
}

module.exports = { getAllUsuarios, getUsuarioById, deleteUsuario, updateUser };
