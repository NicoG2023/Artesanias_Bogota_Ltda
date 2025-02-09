import React, { useState } from "react";
import { API_SERVICIO_CLIENTES } from "../../../../utils/constants";
import "./TablaOrdenesCliente.scss";
import {
  Message,
  Table,
  Pagination,
  Loader,
  Icon,
  Button,
  Popup,
} from "semantic-ui-react";
import { map } from "lodash";
import { ModalOrdenCliente } from "../ModalOrdenCliente";
import { ModalEnvioOrden } from "../ModalEnvioOrden";

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

export function TablaOrdenesCliente({ ordenesHook }) {
  const { ordenes, loading, error, page, setPage, pagination } = ordenesHook;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEnvioModal, setShowEnvioModal] = useState(false);

  if (loading) {
    return <Loader active inline="centered" content="Cargando órdenes..." />;
  }

  if (error) {
    return (
      <Message negative>
        <Message.Header>Error al cargar las órdenes</Message.Header>
        <p>{error.message}</p>
      </Message>
    );
  }

  if (!ordenes || ordenes.length === 0) {
    return <Message info>Actualmente no tienes órdenes registradas.</Message>;
  }

  // Cambiar de página
  const handlePageChange = (e, data) => {
    setPage(data.activePage);
  };

  // Mostrar detalles (ModalOrdenCliente)
  const handleVerDetalles = (orden) => {
    setSelectedOrder(orden);
    setShowEnvioModal(false); // Asegura que no muestre el modal de envío
  };

  const formatoColombiano = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Mostrar estado de envío (ModalEnvioOrden), con fetch para obtener orden actualizada
  async function handleVerEnvio(orden) {
    try {
      const response = await fetch(
        `${API_SERVICIO_CLIENTES}/api/ordenes/${orden.id}`
      );
      const json = await response.json();
      if (response.ok) {
        setSelectedOrder(json.data);
        setShowEnvioModal(true); // aquí sí abrimos el modal de envío
      } else {
        console.error("Error al obtener la orden:", json);
      }
    } catch (error) {
      console.error("Error de red al obtener la orden:", error);
    }
  }

  return (
    <div className="tabla-ordenes">
      <Table celled className="tabla-ordenes-usuario">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            <Table.HeaderCell>Lugar</Table.HeaderCell>
            <Table.HeaderCell>Fecha de Pago</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {map(ordenes, (orden, index) => (
            <Table.Row key={index}>
              <Table.Cell>{formatDate(orden.fecha_orden)}</Table.Cell>
              <Table.Cell>{orden.estado}</Table.Cell>
              <Table.Cell>{formatoColombiano(orden.total)}</Table.Cell>
              <Table.Cell>{orden.puntoVenta?.nombre}</Table.Cell>
              <Table.Cell>{formatDate(orden.pago?.fecha_pago)}</Table.Cell>
              <Table.Cell>
                <Popup
                  content="Mostrar detalles"
                  trigger={
                    <Button icon onClick={() => handleVerDetalles(orden)}>
                      <Icon name="eye" />
                    </Button>
                  }
                  position="top center"
                  inverted
                />
                <Popup
                  content="Ver Estado de Envío"
                  trigger={
                    <Button icon onClick={() => handleVerEnvio(orden)}>
                      <Icon name="truck" />
                    </Button>
                  }
                  position="top center"
                  inverted
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div className="tabla-paginacion">
        {pagination.pages > 1 && (
          <Pagination
            activePage={page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            boundaryRange={1}
            siblingRange={1}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            prevItem={{ content: "Anterior", icon: "angle left" }}
            nextItem={{ content: "Siguiente", icon: "angle right" }}
          />
        )}
      </div>

      {/* Modal de detalles */}
      <ModalOrdenCliente
        visible={!!selectedOrder && !showEnvioModal}
        onHide={() => setSelectedOrder(null)}
        order={selectedOrder}
      />

      {/* Modal para el Envío */}
      <ModalEnvioOrden
        open={showEnvioModal}
        onHide={() => {
          setShowEnvioModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
}
