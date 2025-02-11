import React, { useState } from "react";
import { map } from "lodash";
import {
  Message,
  Table,
  Pagination,
  Loader,
  Button,
  Icon,
} from "semantic-ui-react";
import ActualizarInventario from "../ActualizarInventario/ActualizarInventario"; // Asegúrate de importar el componente
import { toast } from "react-toastify";
import "./TablaInventarios.scss";

export function TablaInventarios({ inventarioHook }) {
  const {
    inventario,
    pagination,
    loading,
    error,
    fetchInventario,
    eliminarProductoInventario,
    actualizarStock,
  } = inventarioHook;
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (inv) => {
    if (!inventarioHook.puntoVenta) {
      toast.warning("Debe seleccionar un punto de venta antes de continuar.");
      return;
    }
    setSelectedInventario(inv);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedInventario(null);
    setOpenModal(false);
  };

  const handleDelete = async (inventarioId) => {
    if (!inventarioHook.puntoVenta) {
      toast.warning("Debe seleccionar un punto de venta antes de continuar.");
      return;
    }
    try {
      await eliminarProductoInventario(inventarioId);
      toast.success("Producto eliminado del inventario");
    } catch (error) {
      toast.error("Error al eliminar el producto del inventario");
    }
  };

  if (loading) {
    return <Loader active inline="centered" content="Cargando inventario..." />;
  }

  if (error) {
    return (
      <Message negative>
        <Message.Header>Error al cargar el inventario</Message.Header>
        <p>{typeof error === "string" ? error : error.message}</p>
      </Message>
    );
  }

  if (!inventario || inventario.length === 0) {
    return <Message info>Actualmente no hay productos en inventario.</Message>;
  }

  return (
    <div className="tabla-inventario">
      <Table celled className="tabla-inventario-admin">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Producto</Table.HeaderCell>
            <Table.HeaderCell>Cantidad</Table.HeaderCell>
            <Table.HeaderCell>Punto de Venta</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {map(inventario, (inv) => (
            <Table.Row key={inv.id}>
              <Table.Cell>{inv.producto.nombre}</Table.Cell>
              <Table.Cell>{inv.cantidad}</Table.Cell>
              <Table.Cell>{inv.nombre_punto_venta}</Table.Cell>
              <Table.Cell textAlign="center">
                <Button className="btn-update" icon color="blue" onClick={() => handleOpenModal(inv)}>
                  <Icon name="truck" color="white" />
                </Button>
                <Button className="btn-delete" icon color="red" onClick={() => handleDelete(inv.id)}>
                  <Icon name="trash" color="white" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    <div className="fixed-footer">
      {/* Paginación */}
      <Pagination
        activePage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(_, data) => fetchInventario(data.activePage)}
      />
    </div>
      {/* Modal para actualizar stock */}
      {selectedInventario && (
        <ActualizarInventario
          open={openModal}
          onClose={handleCloseModal}
          inventario={selectedInventario}
          actualizarStock={actualizarStock}
        />
      )}
    </div>
  );
}
