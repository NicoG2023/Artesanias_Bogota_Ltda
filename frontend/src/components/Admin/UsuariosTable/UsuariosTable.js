import React, { useState, useEffect } from "react";
import { Table, Button, Input, Pagination } from "semantic-ui-react";
import { UsuarioModal } from "../UsuarioModal/UsuarioModal";
import { UsuarioUpdateForm } from "../UsuarioUpdateForm/UsuarioUpdateForm";
import { UsuarioDeleteModal } from "../UsuarioDeleteModal";
import "./UsuariosTable.scss";


export function UsuariosTable({
  usuariosData,
  onUserActionTable,
  currentUserRole,
  currentPage,
  totalPages,
  setCurrentPage,
  onSearch, // Nueva prop para manejar la búsqueda
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  useEffect(() => {
    onSearch(searchQuery); // Llamar a la función de búsqueda cuando cambia el query
  }, [searchQuery, onSearch]);


  const handleEditClick = (usuario) => {
    if (usuario.rol === "superadmin" && currentUserRole === "admin") {
      return;
    }
    setSelectedUsuario(usuario);
    setIsUpdateModalOpen(true);
  };


  const handleDeleteClick = (usuario) => {
    if (usuario.rol === "superadmin" && currentUserRole === "admin") {
      return;
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


  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
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
            {usuariosData.map((usuario) => (
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


      <Pagination
        activePage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        boundaryRange={1}
        siblingRange={1}
        ellipsisItem={{ content: "..." }}
        firstItem={{ content: "Primera", icon: "angle double left" }}
        lastItem={{ content: "Última", icon: "angle double right" }}
      />


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
























