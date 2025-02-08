import React, { useState, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { updateNombreApellidoApi } from "../../../../api/perfil";
import "./UpdateNombreApellidoForm.scss";

export function UpdateNombreApellidoForm({ usuario, onClose, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(usuario);

  useEffect(() => {
    setCurrentUsuario(usuario);
  }, [usuario]);

  const formik = useFormik({
    initialValues: initialValues(currentUsuario),
    validationSchema: Yup.object(validationSchema()),
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formValue) => {
      setLoading(true);
      try {
          await updateNombreApellidoApi(auth.token, formValue);
          toast.success("Información actualizada exitosamente");
          if (onUserActions) await onUserActions();
          if (onClose) onClose();
      } catch (error) {
          toast.error("Error al actualizar información: " + error.message);
      } finally {
          setLoading(false);
      }
      },
  });

  const handleInputChange = (e, { name, value }) => {
    formik.setFieldValue(name, value);
  };

  return (
    <Form className="update-nombreApellido-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        name="nombre"
        placeholder="Nombre"
        value={formik.values.nombre}
        onChange={handleInputChange}
        error={formik.errors.nombre ? { content: formik.errors.nombre, pointing: "below" } : null}
        className="update-user-form__input"
      />
      <Form.Input
        name="apellido"
        placeholder="Apellido"
        value={formik.values.apellido}
        onChange={handleInputChange}
        error={formik.errors.apellido ? { content: formik.errors.apellido, pointing: "below" } : null}
        className="update-user-form__input"
      />
      <Button
              type="submit"
              content={loading ? "Actualizando..." : "Actualizar Usuario"}
              primary
              fluid
              className="update-user-form__button"
              loading={loading}
              disabled={loading}
      />
    </Form>
  );
}

// Valores iniciales para Formik
function initialValues(usuario) {
  return {
    nombre: usuario.nombre || "",
    apellido: usuario.apellido || "",
  };
}

// Esquema de validación con Yup
function validationSchema() {
  return {
    nombre: Yup.string().required("Debe proporcionar un nombre"),
    apellido: Yup.string().required("Debe proporcionar un apellido"),
  };
}