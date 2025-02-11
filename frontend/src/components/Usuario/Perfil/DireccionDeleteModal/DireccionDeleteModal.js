import React, { useState } from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import { deleteDireccionApi } from "../../../../api/direcciones";
import { useAuth } from "../../../../hooks";
import { toast } from "react-toastify";
import "./DireccionDeleteModal.scss";

export function DireccionDeleteModal({ open, onClose, selectedDireccion, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      
      await deleteDireccionApi(auth.token, selectedDireccion.id);
      toast.success("Dirección eliminada exitosamente");

      onUserActions();
      onClose();
    } catch (error) {
      toast.error("Error al eliminar dirección: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small" className="modal-delete-direccion" closeIcon>
      <Modal.Content scrolling>
        <div className="modal-container">
          <h3 className="question-text">
            ¿Está seguro que desea eliminar la dirección {selectedDireccion?.direccion}?
          </h3>
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