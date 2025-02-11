import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Icon,
  Dropdown,
  Loader,
  Message,
} from "semantic-ui-react";
import { toast } from "react-toastify";

export function DesvincularProductoCategoria({
  open,
  onClose,
  categoria,
  obtenerProductosPorCategoria,
  productosPorCategoria = [],
  loadingProductosPorCategoria,
  errorProductosPorCategoria,
  desvincularProductoCategoria,
}) {
  const [selectedProducto, setSelectedProducto] = useState("");

  useEffect(() => {
    if (open && categoria) {
      obtenerProductosPorCategoria(categoria.id);
    }
  }, [open, categoria, obtenerProductosPorCategoria]);

  const handleDesvincular = async () => {
    if (!selectedProducto) {
      toast.warning("Selecciona un producto antes de continuar.");
      return;
    }
    try {
      await desvincularProductoCategoria(selectedProducto, categoria.id);
      toast.success("Producto desvinculado correctamente");
      onClose();
    } catch (error) {
      toast.error("Error al desvincular producto");
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Desvincular Producto de {categoria?.nombre}</Modal.Header>
      <Modal.Content>
        {loadingProductosPorCategoria ? (
          <Loader active inline="centered" content="Cargando productos..." />
        ) : errorProductosPorCategoria ? (
          <Message negative>
            <Message.Header>Error al cargar productos</Message.Header>
            <p>{errorProductosPorCategoria}</p>
          </Message>
        ) : productosPorCategoria.length === 0 ? (
          <Message info>
            <Message.Header>No hay productos vinculados</Message.Header>
            <p>No hay productos relacionados con esta categoría.</p>
          </Message>
        ) : (
          <>
            <Dropdown
              placeholder="Selecciona un producto"
              fluid
              selection
              options={productosPorCategoria.map((producto) => ({
                key: producto.id,
                value: producto.id,
                text: producto.nombre,
              }))}
              value={selectedProducto}
              onChange={(e, { value }) => setSelectedProducto(value)}
            />

            <Button
              color="red"
              onClick={handleDesvincular}
              style={{ marginTop: "15px" }}
            >
              <Icon name="unlink" /> Desvincular
            </Button>
            <Button onClick={onClose} style={{ marginTop: "15px" }}>
              <Icon name="cancel" /> Cancelar
            </Button>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
}
