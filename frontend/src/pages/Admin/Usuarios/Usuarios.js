import React, { useState, useEffect } from "react";
import { UsuarioCreateForm } from '../../../components/Admin/UsuarioCreateForm/UsuarioCreateForm'
import { UsuariosTable } from '../../../components/Admin/UsuariosTable/UsuariosTable'
import { UsuarioModal } from '../../../components/Admin/UsuarioModal/UsuarioModal'
import { useAuth } from "../../../hooks";
import { toast } from "react-toastify";
import { getAllUsuariosApi } from "../../../api/usuario";


export function Usuarios() {
  const[isModalOpen, setIsModalOpen] = useState(false);
  const{ auth } = useAuth();

  // Estado para los usuarios
  const [usuarios, setUsuarios] = useState([]);

  // Fucnión para cargar los usuarios
  const fetchUsuarios = async () => {
    try {
      const usuariosData = await getAllUsuariosApi(auth.token);
      setUsuarios(usuariosData);
    } catch (error) {
      toast.error(`Error al obtener usuarios: ${error.message}`);
    }
  };

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, [auth.token]);
  
  return (
    <div className="usuarios">
      <h1 className="usuarios__title">Registro, actualización e información de usuarios</h1>
      <div className="usuarios__container">
        {/* Botón para abrir el modal */}
        <button className = "button__modal"onClick={()=>setIsModalOpen(true)}>Registrar un nuevo usuario</button>


        <UsuarioModal open={isModalOpen} onClose={() => setIsModalOpen(false)} UsuarioForms={UsuarioCreateForm} onUserAction={fetchUsuarios}/>


        <h1 className="create__usuario__title">Usuarios registrados</h1>
        <div className="usuario__table_container">
         <UsuariosTable usuariosData={usuarios} onUserActionTable={fetchUsuarios} currentUserRole={"admin"}/>
        </div>  
      </div>
    </div>
  )
}


