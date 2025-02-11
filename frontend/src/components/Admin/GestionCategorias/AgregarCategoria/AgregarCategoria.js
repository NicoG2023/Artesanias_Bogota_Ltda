import React, { useState } from "react";
import { Modal, Form, Button, Icon } from "semantic-ui-react";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validación con Yup
const schema = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
});

export function AgregarCategoria({ open, onClose, agregarCategoria }) {
  const [formData, setFormData] = useState({ nombre: "" });
  const [formErrors, setFormErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setFormErrors({});
      setLoadingSubmit(true);

      await agregarCategoria(formData.nombre);
      toast.success("Categoría agregada correctamente");
      onClose();
      setFormData({ nombre: "" });
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Error al agregar categoría:", error);
        toast.error("Error al agregar categoría");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Agregar Nueva Categoría</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} loading={loadingSubmit}>
          <Form.Input
            label="Nombre de la Categoría"
            placeholder="Ejemplo: Ropa Deportiva"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={formErrors.nombre ? { content: formErrors.nombre } : null}
          />
          <Button type="submit" primary>
            <Icon name="save" /> Agregar
          </Button>
          <Button type="button" onClick={onClose}>
            <Icon name="cancel" /> Cancelar
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
