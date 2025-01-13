import React, { useState } from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import { deleteUsuarioApi } from "../../../api/usuario"; 
import { useAuth } from "../../../hooks";
import { toast } from "react-toastify";
import "./UsuarioDeleteModal.scss";

export function UsuarioDeleteModal({ open, onClose, selectedUsuario, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false); // Estado para manejar el loading

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      // Llamada a la API para eliminar el usuario
      await deleteUsuarioApi(auth.token, selectedUsuario.id);
      toast.success("Usuario eliminado exitosamente");

      onUserActions();
      onClose();
    } catch (error) {
      toast.error("Error al eliminar usuario: " + error.message);
    } finally {
      setLoading(false);
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
            ¿Está seguro que desea eliminar al (la) usuario {selectedUsuario?.nombre} {selectedUsuario?.apellido}?
          </h1>
          <div className="buttons-options">
            {/* Botón para confirmar la eliminación */}
            <Button
              className="afirmative-option"
              color="red"
              onClick={handleDeleteConfirm}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
            {/* Botón para cancelar */}
            <Button
              className="cancel-option"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}


