import React from 'react'
import { UsuarioForm } from '../../../components/UsuarioForm/UsuarioForm'
import { UsuariosTable } from '../../../components/UsuarioTable/UsuarioTable'

export function Usuarios() {
  return (
    <div className="usuarios">
      <h1 className="usuarios__title">Configuración e información de usuarios</h1>
      <div className="usuarios__container">
        <h1 className="create__usuario__title">Crear un nuevo usuario</h1>
        <UsuarioForm />
        <h1 className="create__usuario__title">usuarios registrados</h1>
        <UsuariosTable />
            
      </div>
    </div>
  )
}
