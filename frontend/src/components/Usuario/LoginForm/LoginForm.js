import React, { useState } from "react";
import { Button, Form, Icon } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks";
import { loginApi } from "../../../api/usuario";
import "./LoginForm.scss";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formValue) => {
      try {
        const response = await loginApi(formValue);
        const { token } = response;
        const user = await login(token);
        toast.success("Inicio de sesión exitoso");
        // Redirige según el rol del usuario
        const roleToRoute = {
          admin: "/admin",
          cliente: "/productos",
          staff: "/staff-dashboard",
          superadmin: "/UsuariosSuperAdmin",
        };
        console.log("response.rol -->", roleToRoute[user.rol]);
        const redirectRoute = roleToRoute[user.rol] || "/";
        navigate(redirectRoute);
      } catch (error) {
        toast.error("Error al iniciar sesión: " + error.message);
      }
    },
  });

  return (
    <Form className="login-form" onSubmit={formik.handleSubmit}>
      {/* Campo de correo electrónico */}
      <Form.Input
        name="email"
        placeholder="Correo Electrónico"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={
          formik.errors.email
            ? { content: formik.errors.email, pointing: "below" }
            : null
        }
        className="login-form__input"
      />

      {/* Campo de contraseña */}
      <Form.Input
        name="password"
        placeholder="Contraseña"
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        error={
          formik.errors.password
            ? { content: formik.errors.password, pointing: "below" }
            : null
        }
        icon={
          <Icon
            name={showPassword ? "eye slash" : "eye"}
            link
            onClick={() => setShowPassword(!showPassword)}
          />
        }
        className="login-form__input"
      />

      {/* Botón de iniciar sesión */}
      <Button
        type="submit"
        content="Iniciar Sesión"
        primary
        fluid
        className="login-form__button"
      />

      {/* Enlaces de registro y recuperación */}
      <div className="login-form__links">
        <a href="/registro">Regístrate Aquí</a>
        <a href="/request-reset-password">¿Olvidaste tu contraseña?</a>
      </div>
    </Form>
  );
}

// Valores iniciales para Formik
function initialValues() {
  return {
    email: "",
    password: "",
  };
}

// Esquema de validación con Yup
function validationSchema() {
  return {
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("Correo electrónico es obligatorio"),
    password: Yup.string().required("Contraseña es obligatoria"),
  };
}
