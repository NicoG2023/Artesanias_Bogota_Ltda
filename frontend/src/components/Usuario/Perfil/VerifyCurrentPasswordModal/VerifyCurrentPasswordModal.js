import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { verifyCurrentPasswordApi } from "../../../../api/usuario";
import { useAuth } from "../../../../hooks";
import { UpdatePasswordModal } from "../UpdatePasswordModal/UpdatePasswordModal";
import "./VerifyCurrentPasswordModal.scss";

export function VerifyCurrentPasswordModal({ open, onClose, onVerified }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const formik = useFormik({
    initialValues: { currentPassword: "" },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Debe ingresar su contraseña actual"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await verifyCurrentPasswordApi(auth.token, values.currentPassword);
        toast.success("Contraseña verificada correctamente");
        setShowUpdatePassword(true);
        formik.resetForm();
      } catch (error) {
        toast.error("Error al verificar contraseña: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  // Efecto para resetear el formulario cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleUpdatePasswordClose = () => {
    setShowUpdatePassword(false);
    onClose();
  };

  return (
    <>
      <Modal
        open={open && !showUpdatePassword}
        onClose={handleClose}
        size="tiny"
        className="verify-password-modal"
        closeIcon
      >
        <Modal.Header>Verificar Contraseña</Modal.Header>
        <Modal.Content>
          <Form onSubmit={formik.handleSubmit} className="verify-password-form">
            <Form.Input
              type="password"
              name="currentPassword"
              placeholder="Ingrese su contraseña actual"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              error={
                formik.errors.currentPassword
                  ? { content: formik.errors.currentPassword, pointing: "below" }
                  : null
              }
            />
            <Button
              className="btn-verificar"
              type="submit"
              content={loading ? "Verificando..." : "Verificar"}
              primary
              fluid
              loading={loading}
              disabled={loading}
            />
          </Form>
        </Modal.Content>
      </Modal>

      <UpdatePasswordModal
        open={showUpdatePassword}
        onClose={handleUpdatePasswordClose}
        onUserActions={onVerified}
      />
    </>
  );
}
