import React from "react";
import "./TablaOrdenesCliente.scss";
import { Message, Table, Pagination, Loader } from "semantic-ui-react";
import { map } from "lodash";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("es-CO", {
    weekday: "short", // "lun"
    day: "2-digit", // "10"
    month: "2-digit", // "11"
    year: "2-digit", // "24"
    hour: "2-digit", // "10"
    minute: "2-digit", // "15"
    hour12: false, // 24h
  });
}

export function TablaOrdenesCliente({ ordenesHook }) {
  const { ordenes, loading, error, page, setPage, pagination } = ordenesHook;

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
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {map(ordenes, (orden, index) => (
            <Table.Row key={index}>
              <Table.Cell>{formatDate(orden.fecha_orden)}</Table.Cell>
              <Table.Cell>{orden.estado}</Table.Cell>
              <Table.Cell>$ {orden.total}</Table.Cell>
              <Table.Cell>{orden.puntoVenta?.nombre}</Table.Cell>
              <Table.Cell>{formatDate(orden.pago?.fecha_pago)}</Table.Cell>
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
    </div>
  );
}
