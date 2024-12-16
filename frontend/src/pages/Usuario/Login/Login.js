import React from "react";
import { LoginForm } from "../../../components/Usuario/LoginForm/LoginForm";
import "./Login.scss";

export function Login() {
  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Bienvenido a Artesanías Bogotá</h1>
        <LoginForm />
      </div>
    </div>
  );
}
