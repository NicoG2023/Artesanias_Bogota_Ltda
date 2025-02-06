import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Icon } from "semantic-ui-react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "./ActualizarInventario.scss";

// Definimos el esquema de validación con Yup
const schema = Yup.object().shape({
  operacion: Yup.string()
    .oneOf(["venta", "reabastecimiento"], "Operación inválida")
    .required("La operación es requerida"),
  cantidad: Yup.number()
    .positive("La cantidad debe ser mayor a cero")
    .required("La cantidad es requerida"),
});

const ActualizarInventario = ({
  open,
  onClose,
  inventario,
  actualizarStock,
}) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    operacion: "venta",
    cantidad: "",
  });
  // Estado para los errores de validación
  const [formErrors, setFormErrors] = useState({});
  // Estado para indicar carga (cuando se envía el formulario)
  const [loading, setLoading] = useState(false);

  // Cada vez que se abra el modal, reiniciamos el formulario
  useEffect(() => {
    if (open) {
      setFormData({
        operacion: "venta",
        cantidad: "",
      });
      setFormErrors({});
    }
  }, [open]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e, { name, value }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Envía el formulario validando con Yup
  const handleSubmit = async () => {
    try {
      // Validar los datos del formulario
      await schema.validate(formData, { abortEarly: false });
      setFormErrors({});
      setLoading(true);

      // Se asume que el registro de inventario incluye el objeto "producto" con su "sku"
      const sku = inventario.producto.sku;

      // Llamamos a la función para actualizar el stock, pasando además
      // el punto de venta y el nombre (tomados del inventario actual)
      await actualizarStock(sku, {
        cantidad: Number(formData.cantidad),
        operacion: formData.operacion,
        punto_venta_fk: inventario.punto_venta_fk,
        nombre_punto_venta: inventario.nombre_punto_venta,
      });

      toast.success("Stock actualizado con éxito");
      onClose(); // Cerramos el modal tras la operación exitosa
    } catch (error) {
      // Si es error de validación, formateamos los errores para mostrarlos en el formulario
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Error al actualizar stock:", error);
        toast.error("Error al actualizar stock");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      className="actualizar-inventario-modal"
    >
      <Modal.Header>
        Actualizar Stock para {inventario?.producto?.nombre}
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Group widths="equal">
            <Form.Select
              fluid
              label="Operación"
              options={[
                { key: "venta", text: "Venta", value: "venta" },
                {
                  key: "reabastecimiento",
                  text: "Reabastecimiento",
                  value: "reabastecimiento",
                },
              ]}
              placeholder="Selecciona la operación"
              name="operacion"
              value={formData.operacion}
              onChange={handleChange}
              error={
                formErrors.operacion ? { content: formErrors.operacion } : null
              }
            />
            <Form.Input
              fluid
              label="Cantidad"
              placeholder="Ingrese la cantidad"
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              error={
                formErrors.cantidad ? { content: formErrors.cantidad } : null
              }
            />
          </Form.Group>
          <Button type="submit" primary>
            <Icon name="save" /> Actualizar
          </Button>
          <Button type="button" onClick={onClose}>
            <Icon name="cancel" /> Cancelar
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default ActualizarInventario;
