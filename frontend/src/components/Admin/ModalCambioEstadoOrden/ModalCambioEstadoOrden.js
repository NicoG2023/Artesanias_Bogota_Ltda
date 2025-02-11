// ModalCambioEstadoOrden.jsx
import React, { useState } from "react";
import {
  Modal,
  Table,
  Button,
  Icon,
  Dropdown,
  Message,
} from "semantic-ui-react";
import "./ModalCambioEstadoOrden.scss";

/**
 * Función de formateo de fechas (puedes extraerla en otro archivo y reutilizar).
 */
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

/**
 * Opciones de estado (ejemplo); ajusta según tus necesidades de negocio.
 */
const ESTADO_OPCIONES = [
  { key: "pendiente", value: "PENDIENTE", text: "Pendiente" },
  { key: "en_proceso", value: "EN PROCESO", text: "En Proceso" },
  { key: "completada", value: "COMPLETADA", text: "Completada" },
  { key: "cancelada", value: "CANCELADA", text: "Cancelada" },
];

export function ModalCambioEstadoOrden({
  open,
  onClose,
  orden,
  onUpdateEstado, // función callback para actualizar el estado (ej: del hook)
}) {
  // Guardamos el nuevo estado en un estado local del componente
  const [nuevoEstado, setNuevoEstado] = useState(orden?.estado || "");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);

  if (!orden) return null; // Evita renderizar si orden es null/undefined

  const handleEstadoChange = (e, { value }) => {
    setNuevoEstado(value);
  };

  const handleUpdateEstado = async () => {
    try {
      setLoadingUpdate(true);
      setErrorUpdate(null);

      // Llamamos a la función que se encarga de actualizar el estado en tu backend
      // Generalmente vendrá de tu hook 'useOrdenes', por ejemplo:
      //   await updateEstadoOrden(orden.id, nuevoEstado);
      // Aquí lo abstraes a la prop onUpdateEstado:
      await onUpdateEstado(orden.id, nuevoEstado);

      // Cierre automático o seguir abierto, según tu preferencia
      onClose();
    } catch (error) {
      setErrorUpdate(error.message || "Error al actualizar estado");
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      className="modal-cambio-estado-orden"
    >
      <Modal.Header>Cambiar Estado de la Orden #{orden.id}</Modal.Header>

      <Modal.Content>
        {/* Muestra un mensaje de error si ocurre */}
        {errorUpdate && (
          <Message negative>
            <Message.Header>Error al actualizar</Message.Header>
            <p>{errorUpdate}</p>
          </Message>
        )}

        {/* Tabla de datos básicos de la orden */}
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Estado Actual</Table.Cell>
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

        {/* Dropdown para cambiar estado */}
        <div className="estado-dropdown">
          <label style={{ marginRight: "1em" }}>Nuevo Estado:</label>
          <Dropdown
            placeholder="Selecciona un estado"
            selection
            options={ESTADO_OPCIONES}
            value={nuevoEstado}
            onChange={handleEstadoChange}
          />
        </div>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={onClose} disabled={loadingUpdate}>
          <Icon name="remove" /> Cancelar
        </Button>
        <Button primary onClick={handleUpdateEstado} loading={loadingUpdate}>
          <Icon name="checkmark" /> Actualizar Estado
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
