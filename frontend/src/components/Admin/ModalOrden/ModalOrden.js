// ModalOrden.jsx
import React from "react";
import { Modal, Table, Image, Button, Icon } from "semantic-ui-react";
import { map } from "lodash";
import "./ModalOrden.scss";

// Puedes usar la misma función de formateo de fechas
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ModalOrden({ open, onClose, orden }) {
  if (!orden) return null; // Por seguridad, si no hay orden.

  return (
    <Modal open={open} onClose={onClose} size="large" className="modal-orden">
      <Modal.Header>Detalles de la Orden #{orden.id}</Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-orden__content">
          {/* Información principal */}
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={3}>Estado</Table.Cell>
                <Table.Cell>{orden.estado}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total</Table.Cell>
                <Table.Cell>{orden.total}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Fecha Orden</Table.Cell>
                <Table.Cell>{formatDate(orden.fecha_orden)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Fecha Pago</Table.Cell>
                <Table.Cell>{formatDate(orden.pago?.fecha_pago)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Estado Pago</Table.Cell>
                <Table.Cell>{orden.pago?.estado}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Punto de Venta</Table.Cell>
                <Table.Cell>{orden.puntoVenta?.nombre}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Usuario</Table.Cell>
                <Table.Cell>
                  {orden.usuarioNombre} {orden.usuarioApellido} -{" "}
                  {orden.usuarioEmail}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* Lista de productos */}
          <h3>Productos</h3>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Imagen</Table.HeaderCell>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Precio</Table.HeaderCell>
                <Table.HeaderCell>Cantidad</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {map(orden.productosOrden, (prod, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Image
                      src={prod.productoImagen}
                      size="tiny"
                      bordered
                      alt={prod.productoNombre}
                    />
                  </Table.Cell>
                  <Table.Cell>{prod.productoNombre}</Table.Cell>
                  <Table.Cell>{prod.productoPrecio}</Table.Cell>
                  <Table.Cell>{prod.cantidad}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={onClose} primary>
          <Icon name="checkmark" /> Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
