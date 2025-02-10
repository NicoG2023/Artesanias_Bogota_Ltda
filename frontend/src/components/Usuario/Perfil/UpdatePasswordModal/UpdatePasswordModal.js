import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { updatePasswordApi } from "../../../../api/perfil";
import "./UpdatePasswordModal.scss";

export function UpdatePasswordModal({ open, onClose, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formValue) => {
      setLoading(true);
      try {
        await updatePasswordApi(auth.token, formValue);
        toast.success("Contraseña actualizada exitosamente");
        if (onUserActions) await onUserActions();
        if (onClose) onClose();
      } catch (error) {
        toast.error("Error al actualizar contraseña: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const handleInputChange = (e, { name, value }) => {
    formik.setFieldValue(name, value);
  };

  return (
    <Modal open={open} onClose={onClose} size="tiny" className="update-password-modal" closeIcon>
      <Modal.Header>Nueva contraseña</Modal.Header>
      <Modal.Content>
        <Form className="update-password-form" onSubmit={formik.handleSubmit}>
          <Form.Input
            name="password"
            type="password"
            placeholder="Nueva Contraseña"
            value={formik.values.password}
            onChange={handleInputChange}
            error={
              formik.errors.password
                ? { content: formik.errors.password, pointing: "below" }
                : null
            }
            className="update-user-form__input"
          />
          <Form.Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar Nueva Contraseña"
            value={formik.values.confirmPassword}
            onChange={handleInputChange}
            error={
              formik.errors.confirmPassword
                ? { content: formik.errors.confirmPassword, pointing: "below" }
                : null
            }
            className="update-user-form__input"
          />
          <Button
            type="submit"
            content={loading ? "Actualizando..." : "Actualizar Contraseña"}
            primary
            fluid
            className="update-user-form__button"
            loading={loading}
            disabled={loading}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
}

function initialValues() {
  return {
    password: "",
    confirmPassword: "",
  };
}

function validationSchema() {
  return {
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("Debe proporcionar una contraseña"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("Debe confirmar la contraseña"),
  };
}