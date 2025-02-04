// ModalEnvioOrden.jsx
import React from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import { EnvioOrden } from "../EnvioOrden";

export function ModalEnvioOrden({ open, onHide, order }) {
  if (!order) return null;

  return (
    <Modal
      open={open}
      onClose={onHide}
      size="large"
      scrolling // <-- Permite scroll en contenidos largos
    >
      <Modal.Header>Estado de Envío de la Orden #{order.id}</Modal.Header>
      <Modal.Content>
        <EnvioOrden ordenId={order.id} currentEstado={order.estado} />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onHide}>
          <Icon name="close" />
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
