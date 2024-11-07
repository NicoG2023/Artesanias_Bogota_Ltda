const Usuario = require("../models/Usuario");

//Lectura de usuario
//Leer todos los usarios
const getAllUsuarios = async (req,res)=>{
    try {
      const usuarios = await Usuario.findAll()
      res.json(usuarios)
    } catch (error) {
      res.json({message: error.message})
    }
}
  
//Leer un usuario en particular
const getUsuario =async (req,res)=>{
    try {
        const usuario = await Usuario.findOne({
            where: {id:req.params.id}
        })
        res.json(usuario )
    } catch (error) {
        res.json({message: error.message})
    }
}

//Eliminacion de usuario
const deleteUsuario = async (req,res) =>{
    try {
        await Usuario.destroy({
            where: {id:req.params.id}
        })
        res.json({"message": "Usuario eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message})
    }
}

module.exports = { getAllUsuarios, getUsuario, deleteUsuario };