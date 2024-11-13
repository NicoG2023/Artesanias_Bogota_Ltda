const { getAllUsuarios, getUsuarioById } = require("./views");

//Controlador getAllUsuarios
const getAllUsuariosController = async (req, res) => {
    try {
      const usuarios = await getAllUsuarios();
      res.status(200).json(usuarios); // Responde con la lista de usuarios
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message }); // Responde con error si algo falla
    }
};

//Controlador getUsuarioBiId
const getUsuarioController = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await getUsuarioById(id);
      res.status(200).json(usuario); // Responde con el usuario encontrado
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message }); // Responde con error si algo falla
    }
  };

//Controlador deleteUsuario
const deleteUsuarioController = async (req, res) => {
    try {
      const { id } = req.params;
      const response = await deleteUsuarioById(id);
      res.status(200).json(response); // Responde con el mensaje de éxito
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message }); // Responde con error si algo falla
    }
};

  module.exports = { getAllUsuariosController, getUsuarioController, deleteUsuarioController };