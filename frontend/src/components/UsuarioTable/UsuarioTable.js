import React from "react";
import { Table, Button } from "semantic-ui-react";

export function UsuariosTable({ usuarios = [], onEdit, onDelete }) {
  // Datos de prueba
  const usuariosDePrueba = [
    {
      id: 1,
      nombre: "Willie",
      apellido: "Bosco",
      email: "Willie_Bosco@hotmail.com",
      puntos_descuento: 71,
      rol: "cliente",
      es_activo: false,
    },
    {
      id: 2,
      nombre: "Alberto",
      apellido: "Toy",
      email: "Alberto_Toy30@hotmail.com",
      puntos_descuento: 357,
      rol: "superadmin",
      es_activo: false,
    },
    {
      id: 3,
      nombre: "Alphonso",
      apellido: "Swift",
      email: "Alphonso.Swift@hotmail.com",
      puntos_descuento: 55,
      rol: "admin",
      es_activo: true,
    },
    {
      id: 4,
      nombre: "Gino",
      apellido: "Bednar",
      email: "Gino_Bednar@gmail.com",
      puntos_descuento: 8,
      rol: "staff",
      es_activo: true,
    },
  ];

  // Si no se pasa el prop "usuarios", se usan los de prueba
  const usuariosToDisplay = usuarios.length > 0 ? usuarios : usuariosDePrueba;

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Nombre</Table.HeaderCell>
          <Table.HeaderCell>Apellido</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Puntos de descuento</Table.HeaderCell>
          <Table.HeaderCell>Rol</Table.HeaderCell>
          <Table.HeaderCell>Estado</Table.HeaderCell>
          <Table.HeaderCell>Acciones</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {usuariosToDisplay.map((usuario) => (
          <Table.Row key={usuario.id}>
            <Table.Cell>{usuario.id}</Table.Cell>
            <Table.Cell>{usuario.nombre}</Table.Cell>
            <Table.Cell>{usuario.apellido}</Table.Cell>
            <Table.Cell>{usuario.email}</Table.Cell>
            <Table.Cell>{usuario.puntos_descuento}</Table.Cell>
            <Table.Cell>{usuario.rol}</Table.Cell>
            <Table.Cell>{usuario.es_activo ? "Activo" : "Inactivo"}</Table.Cell>
            <Table.Cell>
              <Button onClick={() => onEdit(usuario)}>Editar</Button>
              <Button color="red" onClick={() => onDelete(usuario.id)}>
                Eliminar
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}