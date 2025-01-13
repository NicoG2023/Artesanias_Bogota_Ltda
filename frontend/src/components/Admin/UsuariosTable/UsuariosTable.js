import React, { useState, useEffect } from "react";
import { Table, Button, Dropdown, Input } from "semantic-ui-react";
import { UsuarioModal } from "../UsuarioModal/UsuarioModal";
import { UsuarioUpdateForm } from "../UsuarioUpdateForm/UsuarioUpdateForm";
import { UsuarioDeleteModal } from "../UsuarioDeleteModal";
import "./UsuariosTable.scss";

export function UsuariosTable({ usuariosData, onUserActionTable, currentUserRole }) {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    if (usuariosData) {
      setUsuarios(usuariosData);
    }
  }, [usuariosData]);

  const filteredUsuarios = usuarios
    .filter((usuario) => (selectedRole ? usuario.rol === selectedRole : true))
    .filter((usuario) => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return (
        usuario.nombre.toLowerCase().includes(lowercasedQuery) ||
        usuario.apellido.toLowerCase().includes(lowercasedQuery) ||
        usuario.id.toString().includes(lowercasedQuery)
      );
    })
    .sort((a, b) => (isAscending ? a.id - b.id : b.id - a.id));

  const handleEditClick = (usuario) => {
    if (usuario.rol === "superadmin" && currentUserRole === "admin") {
      return; // Si es superadmin y el rol actual es admin, no se puede hacer nada
    }
    setSelectedUsuario(usuario);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (usuario) => {
    if (usuario.rol === "superadmin" && currentUserRole === "admin") {
      return; // Si es superadmin y el rol actual es admin, no se puede hacer nada
    }
    setSelectedUsuario(usuario);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedUsuario(null);
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  return (
    <div>
      <Input
        icon="search"
        placeholder="Buscar por nombre o ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fluid
      />
      <Dropdown
        placeholder="Filtrar por rol"
        fluid
        selection
        options={[
          { key: "todos", text: "Todos", value: "" },
          { key: "admin", text: "Admin", value: "admin" },
          { key: "cliente", text: "Cliente", value: "cliente" },
          { key: "staff", text: "Staff", value: "staff" },
          { key: "superadmin", text: "Superadmin", value: "superadmin" },
        ]}
        value={selectedRole}
        onChange={(e, { value }) => setSelectedRole(value)}
      />
      <Button onClick={toggleSortOrder} color="blue" style={{ marginTop: "10px" }}>
        Ordenar por ID {isAscending ? "de mayor a menor" : "de menor a mayor"}
      </Button>
      <div className="table-container">
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Apellido</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Puntos</Table.HeaderCell>
              <Table.HeaderCell>Rol</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredUsuarios.map((usuario) => (
              <Table.Row key={usuario.id}>
                <Table.Cell>{usuario.id}</Table.Cell>
                <Table.Cell>{usuario.nombre}</Table.Cell>
                <Table.Cell>{usuario.apellido}</Table.Cell>
                <Table.Cell>{usuario.email}</Table.Cell>
                <Table.Cell>{usuario.puntos_descuento}</Table.Cell>
                <Table.Cell>{usuario.rol}</Table.Cell>
                <Table.Cell>{usuario.es_activo ? "Activo" : "Inactivo"}</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() => handleEditClick(usuario)}
                    disabled={usuario.rol === "superadmin" && currentUserRole === "admin"}
                  >
                    Actualizar
                  </Button>
                  <Button
                    color="red"
                    onClick={() => handleDeleteClick(usuario)}
                    disabled={usuario.rol === "superadmin" && currentUserRole === "admin"}
                  >
                    Eliminar
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      {selectedUsuario && (
        <UsuarioModal
          open={isUpdateModalOpen}
          onClose={handleModalClose}
          UsuarioForms={() => (
            <UsuarioUpdateForm
              usuario={selectedUsuario}
              onClose={handleModalClose}
              onUserActions={onUserActionTable}
            />
          )}
          selectedUsuario={selectedUsuario}
          onUserAction={onUserActionTable}
        />
      )}
      {selectedUsuario && (
        <UsuarioDeleteModal
          open={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          selectedUsuario={selectedUsuario}
          onUserActions={onUserActionTable}
        />
      )}
    </div>
  );
}










