// src/components/Auth/ConfirmarCodigo.jsx
import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verify2faApi } from "../../../api/usuario";
import { useAuth } from "../../../hooks";

export function ConfirmarCodigoForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Se asume que el login previo guardó temporalmente el userId (por ejemplo, en localStorage)
  const tempUserId = localStorage.getItem("tempUserId");

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("El código es requerido")
        .matches(/^\d{6}$/, "El código debe ser de 6 dígitos"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await verify2faApi({
          userId: tempUserId,
          code: values.code,
        });
        // Se espera que la respuesta incluya { token, user }
        const { token, user } = response;

        // Limpiar el userId temporal
        localStorage.removeItem("tempUserId");

        // Guardar el token (por ejemplo, en el contexto de autenticación)
        await login(token);

        toast.success("Inicio de sesión exitoso");

        // Redirigir según el rol del usuario
        const roleToRoute = {
          admin: "/admin",
          cliente: "/productos",
          staff: "/staff-dashboard",
          superadmin: "/UsuariosSuperAdmin",
        };
        const redirectRoute = roleToRoute[user.rol] || "/";
        navigate(redirectRoute);
      } catch (error) {
        console.error("Error en confirmación de código", error);
        toast.error("Error al verificar el código: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div
      className="confirmar-codigo-container"
      style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}
    >
      <h1>Confirmar Código</h1>
      <p>Ingresa el código de autenticación que te fue enviado a tu correo.</p>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Input
          name="code"
          placeholder="Código de 6 dígitos"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={
            formik.errors.code
              ? { content: formik.errors.code, pointing: "below" }
              : null
          }
        />
        <Button type="submit" primary fluid loading={loading}>
          Confirmar Código
        </Button>
      </Form>
    </div>
  );
}
