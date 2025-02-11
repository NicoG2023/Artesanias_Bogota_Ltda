import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Icon } from "semantic-ui-react";
import * as Yup from "yup";
import { toast } from "react-toastify";

const schema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, "Debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
});

export function ActualizarCategoria({
  open,
  onClose,
  categoria,
  actualizarCategoria,
}) {
  const [formData, setFormData] = useState({ nombre: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && categoria) {
      setFormData({ nombre: categoria.nombre });
    }
  }, [open, categoria]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      setLoading(true);
      await actualizarCategoria(categoria.id, formData.nombre);
      toast.success("Categoría actualizada correctamente");
      onClose();
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast.error("Error al actualizar la categoría");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Actualizar Categoría</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Input
            label="Nombre de la Categoría"
            placeholder="Ingrese el nuevo nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre ? { content: errors.nombre } : null}
          />
          <Button type="submit" primary>
            <Icon name="save" /> Guardar Cambios
          </Button>
          <Button type="button" onClick={onClose}>
            <Icon name="cancel" /> Cancelar
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
