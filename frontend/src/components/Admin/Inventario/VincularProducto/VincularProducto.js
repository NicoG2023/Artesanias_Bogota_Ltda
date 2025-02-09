// components/VincularProducto/VincularProducto.jsx
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
import "./VincularProducto.scss";

// Esquema de validación con Yup
const schema = Yup.object().shape({
  productoId: Yup.number().required("Debe seleccionar un producto"),
  cantidad: Yup.number()
    .positive("La cantidad debe ser mayor a cero")
    .required("La cantidad es requerida"),
});

export function VincularProducto({
  open,
  onClose,
  puntoVentaId,
  nombrePuntoVenta,
  vincularProducto, // función: agregarProductoInventario
  productosDisponibles,
  loadingProductosDisponibles,
  errorProductosDisponibles,
  fetchProductosDisponibles,
}) {
  const [formData, setFormData] = useState({
    productoId: "",
    cantidad: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ productoId: "", cantidad: "" });
      setFormErrors({});
      if (puntoVentaId) {
        fetchProductosDisponibles();
      }
    }
  }, [open, puntoVentaId, fetchProductosDisponibles]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setFormErrors({});
      setLoadingSubmit(true);
      await vincularProducto({
        productoId: formData.productoId,
        cantidadInicial: Number(formData.cantidad),
        puntoVentaId,
        nombrePuntoVenta,
      });
      toast.success("Producto vinculado exitosamente");
      onClose();
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Error al vincular producto:", error);
        toast.error("Error al vincular producto");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  console.log("productosDisponibles", productosDisponibles);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      className="vincular-producto-modal"
    >
      <Modal.Header>Vincular Producto al Punto de Venta</Modal.Header>
      <Modal.Content>
        {loadingProductosDisponibles ? (
          <Loader
            active
            inline="centered"
            content="Cargando productos disponibles..."
          />
        ) : errorProductosDisponibles ? (
          <Message negative>
            <Message.Header>Error al cargar productos</Message.Header>
            <p>{errorProductosDisponibles}</p>
          </Message>
        ) : (
          <Form onSubmit={handleSubmit} loading={loadingSubmit}>
            <Form.Field>
              <label>Producto</label>
              <Dropdown
                placeholder="Selecciona un producto"
                fluid
                selection
                options={productosDisponibles.map((producto) => ({
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
            <Form.Input
              label="Cantidad"
              placeholder="Cantidad"
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              error={
                formErrors.cantidad ? { content: formErrors.cantidad } : null
              }
            />
            <Button type="submit" primary>
              <Icon name="save" /> Vincular Producto
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
