import React, { useState } from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import { eliminarPuntoDeVentaApi } from "../../../../api/puntosVenta"; 
import { useAuth } from "../../../../hooks";
import { toast } from "react-toastify";
import "./PuntosVentaDeleteModal.scss";

export function PuntosVentaDeleteModal({ open, onClose, selectedPuntoVenta, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false); // Estado para manejar el loading

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      // Llamada a la API para eliminar el punto de venta
      await eliminarPuntoDeVentaApi(auth.token, selectedPuntoVenta.id);
      toast.success("Punto de venta eliminado exitosamente");

      onUserActions();
      onClose();
    } catch (error) {
      toast.error("Error al eliminar punto de venta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small" className="modal-form-puntoVenta" closeIcon>
      <Modal.Header className="header-title">Eliminar un punto de venta</Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-container">
          <h3 className="question-text">
            ¿Está seguro que desea eliminar el punto de venta {selectedPuntoVenta?.nombre}?
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