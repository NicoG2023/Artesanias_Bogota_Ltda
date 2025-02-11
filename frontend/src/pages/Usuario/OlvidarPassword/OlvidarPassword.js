import React, { useState } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import { useUsuario } from "../../../hooks";
import "./OlvidarPassword.scss";

export function OlvidarPassword() {
  const { solicitarResetPassword, loading, error } = useUsuario();
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async () => {
    try {
      await solicitarResetPassword(email);
      setMensaje(
        "Correo enviado con instrucciones para restablecer contraseña."
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-form">
      <h2>Restablecer Contraseña</h2>
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
          label="Correo electrónico"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          primary
          loading={loading}
          className="auth-form__button"
        >
          Enviar Instrucciones
        </Button>
      </Form>
    </div>
  );
}
