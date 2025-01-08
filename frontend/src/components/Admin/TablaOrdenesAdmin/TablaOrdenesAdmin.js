import React, { useState } from "react";
import "./TablaOrdenesAdmin.scss";
import {
  Message,
  Table,
  Pagination,
  Loader,
  Button,
  Icon,
} from "semantic-ui-react";
import { map } from "lodash";
import { ModalOrden } from "../ModalOrden";

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

export function TablaOrdenesAdmin({ ordenesHook }) {
  const {
    ordenes,
    loading,
    error,
    page,
    setPage,
    pagination,
    searchTerm,
    setSearchTerm,
  } = ordenesHook;
  // Estado local para el modal
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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
    return <Message info>Actualmente no hay órdenes registradas.</Message>;
  }

  // Función para abrir el modal y setear la orden seleccionada
  const mostrarInfoOrden = (orden) => {
    setSelectedOrden(orden);
    setOpenModal(true);
  };

  const handlePageChange = (e, data) => {
    setPage(data.activePage);
  };

  // Función para cerrar el modal
  const onCloseModal = () => {
    setOpenModal(false);
    setSelectedOrden(null);
  };

  return (
    <div className="tabla-ordenes">
      <Table celled className="tabla-ordenes-admin">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Cliente</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            <Table.HeaderCell>Lugar</Table.HeaderCell>
            <Table.HeaderCell>Fecha de Pago</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell> {/* Nueva columna */}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {map(ordenes, (orden, index) => (
            <Table.Row key={index}>
              <Table.Cell>{formatDate(orden.fecha_orden)}</Table.Cell>
              <Table.Cell>{orden.estado}</Table.Cell>
              <Table.Cell>
                {orden.usuarioNombre} {orden.usuarioApellido}
              </Table.Cell>
              <Table.Cell>{orden.total}</Table.Cell>
              <Table.Cell>{orden.puntoVenta?.nombre}</Table.Cell>
              <Table.Cell>{formatDate(orden.pago?.fecha_pago)}</Table.Cell>

              {/* Botón para ver detalles */}
              <Table.Cell textAlign="right">
                <Button icon onClick={() => mostrarInfoOrden(orden)}>
                  <Icon name="address card" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div className="tabla-ordenes-admin__paginacion">
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

      {/* Modal de detalles de la orden */}
      <ModalOrden
        open={openModal}
        onClose={onCloseModal}
        orden={selectedOrden}
      />
    </div>
  );
}
