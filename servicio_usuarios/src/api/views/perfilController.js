const { Usuario } = require("../../models");
const bcrypt = require("bcrypt");

const updateNombreApellido = async (req, res) => {
    try {
      const { userId } = req.user;
      const { nombre, apellido } = req.body;
  
      if (!nombre && !apellido) {
        return res.status(400).json({ message: "Debe proporcionar al menos un campo: nombre o apellido" });
      }
  
      const camposActualizados = {};
      if (nombre) camposActualizados.nombre = nombre;
      if (apellido) camposActualizados.apellido = apellido;
  
      await Usuario.update(camposActualizados, { where: { id: userId } });
  
      res.status(200).json({ message: "Nombre y/o apellido actualizados correctamente" });
    } catch (error) {
      console.error("Error en actualizarNombreApellido:", error);
      res.status(500).json({ message: "Error al actualizar el nombre y/o apellido" });
    }
};

const updateEmail = async (req, res) => {
  try {
    const { userId } = req.user;
    const { nuevoEmail } = req.body;

    if (!nuevoEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(nuevoEmail)) {
      return res.status(400).json({ message: "Formato de correo electrónico no válido" });
    }

    const emailExistente = await Usuario.findOne({ where: { email: nuevoEmail } });
    if (emailExistente) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso" });
    }

    await Usuario.update({ email: nuevoEmail }, { where: { id: userId } });

    res.status(200).json({ message: "Correo electrónico actualizado correctamente" });
  } catch (error) {
    console.error("Error en actualizarEmail:", error);
    res.status(500).json({ message: "Error al actualizar el correo electrónico" });
  }
};

const updateContrasena = async (req, res) => {
    try {
      const { userId } = req.user;
      const { nuevaContrasena } = req.body;
  
      if (!nuevaContrasena || nuevaContrasena.length < 8) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);
  
      await Usuario.update({ password: hashedPassword }, { where: { id: userId } });
  
      res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.error("Error en actualizarContrasena:", error);
      res.status(500).json({ message: "Error al actualizar la contraseña" });
    }
};


module.exports = { updateNombreApellido, updateEmail,  updateContrasena};
