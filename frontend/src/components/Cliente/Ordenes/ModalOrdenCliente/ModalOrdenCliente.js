import React from "react";
import { Modal, Table, Image, Button, Icon } from "semantic-ui-react";
import { map } from "lodash";
import "./ModalOrdenCliente.scss";

const formatCurrency = (valor) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
};

const formatDate = (dateString) => {
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
};

export function ModalOrdenCliente({ visible, onHide, order }) {
  if (!order) return null;

  return (
    <Modal open={visible} onClose={onHide} size="large" className="modal-orden">
      <Modal.Header>Detalles de la Orden #{order.id}</Modal.Header>
      <Modal.Content scrolling>
        <div className="modal-orden-content">
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={3}>Estado</Table.Cell>
                <Table.Cell>{order.estado}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total</Table.Cell>
                <Table.Cell>{formatCurrency(order.total)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Fecha Orden</Table.Cell>
                <Table.Cell>{formatDate(order.fecha_orden)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Fecha Pago</Table.Cell>
                <Table.Cell>{formatDate(order.pago?.fecha_pago)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Punto de Venta</Table.Cell>
                <Table.Cell>{order.puntoVenta?.nombre}</Table.Cell>
              </Table.Row>
              {order.direccion ? (
                <Table.Row>
                  <Table.Cell>Dirección</Table.Cell>
                  <Table.Cell>
                    {order.direccion.direccion}, {order.direccion.ciudad},{" "}
                    {order.direccion.departamento}, {order.direccion.pais}
                  </Table.Cell>
                </Table.Row>
              ) : (
                <Table.Row>
                  <Table.Cell>Lugar de Compra</Table.Cell>
                  <Table.Cell>Comprado en Establecimiento</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          <h3>Productos</h3>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Imagen</Table.HeaderCell>
                <Table.HeaderCell>Producto</Table.HeaderCell>
                <Table.HeaderCell>Precio</Table.HeaderCell>
                <Table.HeaderCell>Cantidad</Table.HeaderCell>
                <Table.HeaderCell>Subtotal</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {map(order.productosOrden, (prod, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Image src={prod.productoImagen} size="tiny" bordered />
                  </Table.Cell>
                  <Table.Cell>{prod.productoNombre}</Table.Cell>
                  <Table.Cell>
                    {formatCurrency(prod.productoPrecio * 1000)}
                  </Table.Cell>
                  <Table.Cell>{prod.cantidad}</Table.Cell>
                  <Table.Cell>
                    {formatCurrency(prod.cantidad * prod.productoPrecio * 1000)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onHide} primary>
          <Icon name="checkmark" /> Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
