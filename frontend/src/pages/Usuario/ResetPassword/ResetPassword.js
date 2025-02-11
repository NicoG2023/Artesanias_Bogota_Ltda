import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Form, Button, Message, Icon } from "semantic-ui-react";
import { useUsuario } from "../../../hooks";
import "./ResetPassword.scss";

export function ResetPassword() {
  const { resetPassword, loading, error } = useUsuario();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setFormErrors({ confirmPassword: "Las contraseñas no coinciden" });
      return;
    }
    try {
      await resetPassword(token, newPassword);
      setMensaje("Contraseña restablecida con éxito.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-form">
      <h2>Establecer Nueva Contraseña</h2>
      {mensaje && (
        <Message positive className="auth-form__message">
          {mensaje}
        </Message>
      )}
      {error && (
        <Message negative className="auth-form__message">
          {error}
        </Message>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Input
          className="auth-form__input"
          type={showPassword ? "text" : "password"}
          label="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          icon={
            <Icon
              name={showPassword ? "eye slash" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
        <Form.Input
          className="auth-form__input"
          type={showConfirmPassword ? "text" : "password"}
          label="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={
            formErrors.confirmPassword
              ? { content: formErrors.confirmPassword, pointing: "below" }
              : null
          }
          icon={
            <Icon
              name={showConfirmPassword ? "eye slash" : "eye"}
              link
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />
        <Button
          type="submit"
          primary
          loading={loading}
          className="auth-form__button"
        >
          Guardar Contraseña
        </Button>
      </Form>
    </div>
  );
}
