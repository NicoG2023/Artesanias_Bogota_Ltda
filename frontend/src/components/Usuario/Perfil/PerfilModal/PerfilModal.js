import React from "react";
import { Modal, Button, Icon} from "semantic-ui-react";
import "./PerfilModal.scss";

export function PerfilModal({ open, onClose, usuario, Formulario, titulo, onUserActions }){
    const handleClose = () => {
        if (onClose) onClose();
    };

    return(
        <Modal 
            open={open} 
            onClose={handleClose} 
            size="large" 
            className="modal-form-usuario"
            closeIcon
        >
            <Modal.Header className="header-title">{titulo}</Modal.Header>
            <Modal.Content scrolling>
                <div className="contenedor-modal">
                    <Formulario 
                        usuario={usuario} 
                        onClose={handleClose}
                        onUserActions={onUserActions}
                    />
                </div>
            </Modal.Content>
        </Modal>
    );
}
