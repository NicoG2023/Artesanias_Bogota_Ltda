import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Icon,
  Dropdown,
  Loader,
  Message,
} from "semantic-ui-react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "./VincularProductoCategoria.scss";

// Esquema de validación con Yup
const schema = Yup.object().shape({
  productoId: Yup.number().required("Debe seleccionar un producto"),
});

export function VincularProductoCategoria({
  open,
  onClose,
  categoria,
  relacionarProductoCategoria,
  obtenerProductosNoRelacionados,
  productosNoRelacionados,
  loadingProductosNoRelacionados,
  errorProductosNoRelacionados,
}) {
  const [formData, setFormData] = useState({ productoId: "" });
  const [formErrors, setFormErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // 🔹 Cargar productos no relacionados al abrir el modal
  useEffect(() => {
    if (open && categoria) {
      setFormData({ productoId: "" });
      setFormErrors({});
      obtenerProductosNoRelacionados(categoria.id); // 🔹 Llamamos a la API para actualizar el estado
    }
  }, [open, categoria, obtenerProductosNoRelacionados]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setFormErrors({});
      setLoadingSubmit(true);

      await relacionarProductoCategoria(formData.productoId, categoria.id);
      toast.success(`Producto vinculado a "${categoria.nombre}" exitosamente`);
      onClose();
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Error al vincular producto con categoría:", error);
        toast.error("Error al vincular producto con categoría");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Vincular Producto a {categoria?.nombre}</Modal.Header>
      <Modal.Content>
        {loadingProductosNoRelacionados ? (
          <Loader active inline="centered" content="Cargando productos..." />
        ) : errorProductosNoRelacionados ? (
          <Message negative>
            <Message.Header>Error al cargar productos</Message.Header>
            <p>{errorProductosNoRelacionados}</p>
          </Message>
        ) : productosNoRelacionados.length === 0 ? (
          <Message info>
            <Message.Header>No hay productos disponibles</Message.Header>
            <p>Todos los productos ya están vinculados a esta categoría.</p>
          </Message>
        ) : (
          <Form onSubmit={handleSubmit} loading={loadingSubmit}>
            <Form.Field>
              <label>Producto</label>
              <Dropdown
                placeholder="Selecciona un producto"
                fluid
                selection
                options={productosNoRelacionados.map((producto) => ({
                  key: producto.id,
                  value: producto.id,
                  text: producto.nombre,
                }))}
                name="productoId"
                value={formData.productoId}
                onChange={handleChange}
                error={
                  formErrors.productoId
                    ? { content: formErrors.productoId }
                    : null
                }
              />
            </Form.Field>

            <Button type="submit" primary>
              <Icon name="save" /> Vincular
            </Button>
            <Button type="button" onClick={onClose}>
              <Icon name="cancel" /> Cancelar
            </Button>
          </Form>
        )}
      </Modal.Content>
    </Modal>
  );
}
