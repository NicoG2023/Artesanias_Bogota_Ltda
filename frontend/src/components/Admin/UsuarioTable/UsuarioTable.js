import React, { useState, useEffect } from "react";
import { Table, Button, Dropdown, Input } from "semantic-ui-react";
import { getAllUsuariosApi } from "../../../api/usuario"; // Asegúrate de que este path es correcto
import { useAuth } from "../../../hooks";
import { UsuarioModal } from "../UsuarioModal/UsuarioModal";
import { UsuarioUpdateForm } from "../UsuarioUpdateForm/UsuarioUpdateForm";
import { UsuarioDeleteModal } from "../UsuarioDeleteModal";
//import "./UsuarioTable.scss";

export function UsuariosTable({ onEdit, onDelete }) {
  const { auth } = useAuth();
  // Estado para los usuarios
  const [usuarios, setUsuarios] = useState([]);
  // Estado para el filtro de rol
  const [selectedRole, setSelectedRole] = useState("");
  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  // Estado para la carga
  const [loading, setLoading] = useState(true);
  // Estado para el usuario seleccionado en la edición
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  // Estado para controlar si el modal de actualización está abierto
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // Estado para controlar si el modal de eliminación está abierto
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        setLoading(true);
        const usuariosData = await getAllUsuariosApi(auth.token);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, [auth.token]);

  // Filtrar usuarios por rol y búsqueda
  const filteredUsuarios = usuarios
    .filter((usuario) => {
      return selectedRole ? usuario.rol === selectedRole : true;
    })
    .filter((usuario) => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const queryWords = lowercasedQuery.split(" ");
      const matchesNameOrSurname = queryWords.every((word) =>
        usuario.nombre.toLowerCase().includes(word) || usuario.apellido.toLowerCase().includes(word)
      );
      return (
        matchesNameOrSurname || usuario.id.toString().includes(lowercasedQuery)
      );
    });

  // Opciones para el dropdown de roles
  const roleOptions = [
    { key: "todos", text: "Todos", value: "" },
    { key: "admin", text: "Admin", value: "admin" },
    { key: "cliente", text: "Cliente", value: "cliente" },
    { key: "staff", text: "Staff", value: "staff" },
    { key: "superadmin", text: "Superadmin", value: "superadmin" },
  ];

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  const handleEditClick = (usuario) => {
    setSelectedUsuario(usuario); // Establecer el usuario seleccionado
    setIsUpdateModalOpen(true); // Abrir el modal de actualización
  };

  const handleDeleteClick = (usuario) => {
    setSelectedUsuario(usuario); // Establecer el usuario seleccionado para eliminar
    setIsDeleteModalOpen(true); // Abrir el modal de eliminación
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false); // Cerrar el modal de actualización
    setSelectedUsuario(null); // Limpiar el usuario seleccionado
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false); // Cerrar el modal de eliminación
    setSelectedUsuario(null); // Limpiar el usuario seleccionado
  };

  // Función para manejar la confirmación de eliminación
  const handleDeleteConfirm = (usuarioId) => {
    // Eliminar el usuario de la lista localmente
    setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== usuarioId));
    setIsDeleteModalOpen(false); // Cerrar el modal después de eliminar
  };

  return (
    <div>
      {/* Barra de búsqueda */}
      <Input
        icon="search"
        placeholder="Buscar por nombre o ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fluid
      />

      {/* Dropdown para seleccionar rol */}
      <Dropdown
        placeholder="Filtrar por rol"
        fluid
        selection
        options={roleOptions}
        value={selectedRole}
        onChange={(e, { value }) => setSelectedRole(value)}
      />

      {/* Contenedor de la tabla con desplazamiento */}
      <div className="table-container">
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
                  <Button onClick={() => handleEditClick(usuario)}>Actualizar</Button>
                  <Button color="red" onClick={() => handleDeleteClick(usuario)}>
                    Eliminar
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Modal para actualizar el usuario */}
      {selectedUsuario && (
        <UsuarioModal
          open={isUpdateModalOpen}
          onClose={handleModalClose}
          UsuarioForms={() => <UsuarioUpdateForm usuario={selectedUsuario} onClose={handleModalClose} />}
          selectedUsuario={selectedUsuario}
        />
      )}

      {/* Modal para eliminar el usuario */}
      {selectedUsuario && (
        <UsuarioDeleteModal
          open={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          selectedUsuario={selectedUsuario}
          onDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}







