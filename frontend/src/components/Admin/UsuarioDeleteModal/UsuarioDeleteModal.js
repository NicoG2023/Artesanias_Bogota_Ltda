import React, { useState } from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import { deleteUsuarioApi } from "../../../api/usuario"; // Importa la API de eliminación
import { useAuth } from "../../../hooks";
import { toast } from "react-toastify";
import "./UsuarioDeleteModal.scss";

export function UsuarioDeleteModal({ open, onClose, selectedUsuario, setUsuarios }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false); // Estado para manejar el loading

  // Función para manejar la eliminación del usuario
  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      // Llamada a la API para eliminar el usuario
      await deleteUsuarioApi(auth.token, selectedUsuario.id);
      toast.success("Usuario eliminado exitosamente");

      // Actualizar la lista de usuarios, eliminando al usuario de la lista (si setUsuarios es necesario más adelante)
      if (setUsuarios) {
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== selectedUsuario.id));
      }

      onClose(); // Cierra el modal tras éxito
    } catch (error) {
      toast.error("Error al eliminar usuario: " + error.message);
    } finally {
      setLoading(false); // Restablece el estado de loading
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small" className="modal-form-usuario">
      <button className="close-button" onClick={onClose}>
        <Icon name="close" />
      </button>
      <Modal.Header className="header-title">Eliminar un usuario</Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-container">
          <h1 className="question-text">
            ¿Está seguro que desea eliminar el usuario {selectedUsuario?.nombre} {selectedUsuario?.apellido}?
          </h1>
          <div className="buttons-options">
            {/* Botón para confirmar la eliminación */}
            <Button
              className="afirmative-option"
              color="red"
              onClick={handleDeleteConfirm} // Llama a la función para eliminar el usuario
              loading={loading} // Muestra un indicador de carga
              disabled={loading} // Deshabilita el botón mientras se elimina
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
            {/* Botón para cancelar */}
            <Button
              className="cancel-option"
              onClick={onClose} // Simplemente cierra el modal
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}


