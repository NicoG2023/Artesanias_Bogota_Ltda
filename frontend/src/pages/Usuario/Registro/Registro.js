import React from "react";
import { RegisterForm } from "../../../components/Usuario/RegisterForm/RegisterForm";
import "./Registro.scss";

export function Registro() {
  return (
    <div className="registro">
      <div className="registro__container">
        <h1 className="registro__title">Registrarse</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
