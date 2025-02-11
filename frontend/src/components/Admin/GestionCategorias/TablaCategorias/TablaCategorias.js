import React, { useState } from "react";
import { map } from "lodash";
import { Message, Table, Loader, Button, Icon, Popup } from "semantic-ui-react";
import { toast } from "react-toastify";
import { ActualizarCategoria } from "../ActualizarCategoria";
import { VincularProductoCategoria } from "../VincularProductoCategoria";
import { DesvincularProductoCategoria } from "../DesvincularProductoCategoria";
import "./TablaCategorias.scss";

export function TablaCategorias({ categoriaHook }) {
  const {
    categorias,
    loading,
    error,
    obtenerCategorias,
    eliminarCategoria,
    relacionarProductoCategoria,
    obtenerProductosNoRelacionados,
    productosNoRelacionados,
    loadingProductosNoRelacionados,
    errorProductosNoRelacionados,
    obtenerProductosPorCategoria,
    productosPorCategoria,
    loadingProductosPorCategoria,
    errorProductosPorCategoria,
    desvincularProductoCategoria,
  } = categoriaHook;

  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openVincularModal, setOpenVincularModal] = useState(false);
  const [openDesvincularModal, setOpenDesvincularModal] = useState(false);

  const handleOpenDesvincularModal = (categoria) => {
    setSelectedCategoria(categoria);
    obtenerProductosPorCategoria(categoria.id);
    setOpenDesvincularModal(true);
  };

  const handleCloseDesvincularModal = () => {
    setSelectedCategoria(null);
    setOpenDesvincularModal(false);
  };

  const handleDelete = async (categoriaId) => {
    try {
      await eliminarCategoria(categoriaId);
      toast.success("Categoría eliminada correctamente");
      obtenerCategorias();
    } catch (error) {
      toast.error("Error al eliminar la categoría");
    }
  };

  const handleOpenUpdateModal = (categoria) => {
    setSelectedCategoria(categoria);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedCategoria(null);
    setOpenUpdateModal(false);
  };

  const handleOpenVincularModal = (categoria) => {
    setSelectedCategoria(categoria);
    obtenerProductosNoRelacionados(categoria.id);
    setOpenVincularModal(true);
  };

  const handleCloseVincularModal = () => {
    setSelectedCategoria(null);
    setOpenVincularModal(false);
  };

  if (loading) {
    return <Loader active inline="centered" content="Cargando categorías..." />;
  }

  if (error) {
    return (
      <Message negative>
        <Message.Header>Error al cargar las categorías</Message.Header>
        <p>{typeof error === "string" ? error : error.message}</p>
      </Message>
    );
  }

  if (!categorias || categorias.length === 0) {
    return <Message info>No hay categorías registradas.</Message>;
  }

  return (
    <div className="tabla-categorias">
      <Table celled className="tabla-categorias-admin">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {map(categorias, (categoria) => (
            <Table.Row key={categoria.id}>
              <Table.Cell>{categoria.id}</Table.Cell>
              <Table.Cell>{categoria.nombre}</Table.Cell>
              <Table.Cell textAlign="center">
                <Popup
                  content="Editar categoría"
                  trigger={
                    <Button
                      icon
                      color="blue"
                      onClick={() => handleOpenUpdateModal(categoria)}
                    >
                      <Icon name="edit" />
                    </Button>
                  }
                  position="top center"
                  inverted
                />
                <Popup
                  content="Vincular producto"
                  trigger={
                    <Button
                      icon
                      color="green"
                      onClick={() => handleOpenVincularModal(categoria)}
                    >
                      <Icon name="linkify" />
                    </Button>
                  }
                  position="top center"
                  inverted
                />
                <Popup
                  content="Eliminar categoría"
                  trigger={
                    <Button
                      icon
                      color="red"
                      onClick={() => handleDelete(categoria.id)}
                    >
                      <Icon name="trash" />
                    </Button>
                  }
                  position="top center"
                  inverted
                />
                <Popup
                  content="Desvincular producto"
                  trigger={
                    <Button
                      icon
                      color="orange"
                      onClick={() => handleOpenDesvincularModal(categoria)}
                    >
                      <Icon name="unlink" />
                    </Button>
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Modal para actualizar nombre de la categoría */}
      {selectedCategoria && (
        <ActualizarCategoria
          open={openUpdateModal}
          onClose={handleCloseUpdateModal}
          categoria={selectedCategoria}
          actualizarCategoria={categoriaHook.actualizarCategoria}
        />
      )}

      {/* Modal para vincular producto a categoría */}
      {selectedCategoria && (
        <VincularProductoCategoria
          open={openVincularModal}
          onClose={handleCloseVincularModal}
          categoria={selectedCategoria}
          relacionarProductoCategoria={relacionarProductoCategoria}
          obtenerProductosNoRelacionados={obtenerProductosNoRelacionados}
          productosNoRelacionados={productosNoRelacionados}
          loadingProductos={loadingProductosNoRelacionados}
          errorProductos={errorProductosNoRelacionados}
        />
      )}

      {selectedCategoria && (
        <DesvincularProductoCategoria
          open={openDesvincularModal}
          onClose={handleCloseDesvincularModal}
          categoria={selectedCategoria}
          obtenerProductosPorCategoria={obtenerProductosPorCategoria}
          productosPorCategoria={productosPorCategoria}
          loadingProductosPorCategoria={loadingProductosPorCategoria}
          errorProductosPorCategoria={errorProductosPorCategoria}
          desvincularProductoCategoria={desvincularProductoCategoria}
        />
      )}
    </div>
  );
}
