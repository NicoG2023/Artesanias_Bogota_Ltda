const Usuario = require("../models/Usuario");

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

module.exports = updateUser;