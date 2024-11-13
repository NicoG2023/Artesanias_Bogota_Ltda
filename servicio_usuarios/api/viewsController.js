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

const updateUsuarioController = async (req, res) => {
  try {
    // Extrae el ID del usuario de los parámetros de la solicitud
    const { id } = req.params;
    
    // Extrae los datos actualizados del cuerpo de la solicitud
    const updatedData = req.body;
    
    // Llama a la función updateUser para actualizar el usuario en la base de datos
    const updatedUser = await updateUser(id, updatedData);
    
    // Si la actualización es exitosa, responde con el usuario actualizado y un estado 200
    res.status(200).json(updatedUser);
  } catch (error) {
    // Si ocurre un error, lo registra en la consola y responde con un estado 400 y el mensaje de error
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getAllUsuariosController, getUsuarioController, deleteUsuarioController, updateUsuarioController };