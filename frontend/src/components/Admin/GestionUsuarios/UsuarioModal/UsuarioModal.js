import React from "react";
import { Modal, Button, Icon} from "semantic-ui-react";
import "./UsuarioModal.scss";

export function UsuarioModal({ open, onClose, UsuarioForms, selectedUsuario, onUserAction }){
  const headerTitle = selectedUsuario ? "Actualizar usuario" : "Registrar un usuario";

  return(
    <Modal open={open} onClose={onClose} size="large" className="modal-form-usuario">
      <button className="close-button" onClick={onClose}>
       <Icon name="close" />
      </button>
      <Modal.Header className="header-title">{headerTitle}</Modal.Header>
      <Modal.Content scrolling>
        <div className="contenedor-modal">
          <UsuarioForms onUserActions={onUserAction}/>
        </div>
      </Modal.Content>
    </Modal>
  );
}











