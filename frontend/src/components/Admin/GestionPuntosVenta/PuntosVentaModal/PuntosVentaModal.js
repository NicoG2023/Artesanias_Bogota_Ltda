import React from "react";
import { Modal, Icon} from "semantic-ui-react";
import "./PuntosVentaModal.scss";

export function PuntosVentaModal({ open, onClose, PuntosVentaForms, selectedPuntoVenta, onUserAction }){
  const headerTitle = selectedPuntoVenta ? "Actualizar punto de venta" : "Registrar un punto de venta";

  return(
    <Modal open={open} onClose={onClose} size="large" className="modal-form-puntoVenta">
      <button className="close-button" onClick={onClose}>
       <Icon name="close" />
      </button>
      <Modal.Header className="header-title">{headerTitle}</Modal.Header>
      <Modal.Content scrolling>
        <div className="contenedor-modal">
          <PuntosVentaForms onUserActions={onUserAction}/>
        </div>
      </Modal.Content>
    </Modal>
  );
}