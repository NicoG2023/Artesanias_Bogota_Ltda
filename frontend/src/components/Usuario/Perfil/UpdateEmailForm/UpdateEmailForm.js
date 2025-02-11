import React, { useState, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { updateEmailApi } from "../../../../api/perfil";
import "./UpdateEmailForm.scss";

export function UpdateEmailForm({ usuario, onClose, onUserActions }) {
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
          await updateEmailApi(auth.token, formValue);
          toast.success("Correo electrónico actualizado exitosamente");
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
    <Form className="update-email-form" onSubmit={formik.handleSubmit}>
        <Form.Input
            name="email"
            placeholder="Correo Electrónico"
            value={formik.values.email}
            onChange={handleInputChange}
            error={formik.errors.email ? { content: formik.errors.email, pointing: "below" } : null}
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
    email: usuario.email || "",
  };
}

// Esquema de validación con Yup
function validationSchema() {
  return {
    email: Yup.string().email("Correo electrónico no válido").required("Debe proporcionar un correo electrónico"),
  };
}