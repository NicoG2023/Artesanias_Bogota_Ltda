import React, { useState } from "react";
import { UsuarioForm } from '../../../components/Admin/UsuarioForm/UsuarioForm'
import { UsuariosTable } from '../../../components/Admin/UsuarioTable/UsuarioTable'
import { UsuarioModal } from '../../../components/Admin/UsuarioModal/UsuarioModal'


export function Usuarios() {
  const[isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="usuarios">
      <h1 className="usuarios__title">Registro, actualización e información de usuarios</h1>
      <div className="usuarios__container">
        {/* Botón para abrir el modal */}
        <button className = "button__modal"onClick={()=>setIsModalOpen(true)}>Registrar un nuevo usuario</button>


        <UsuarioModal open={isModalOpen} onClose={() => setIsModalOpen(false)} UsuarioForms={UsuarioForm} />


        <h1 className="create__usuario__title">Usuarios registrados</h1>
        <div className="usuario__table_container_container">
         <UsuariosTable />
        </div>  
      </div>
    </div>
  )
}


