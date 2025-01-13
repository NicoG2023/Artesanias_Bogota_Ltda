import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks";
import { createUsuarioApi } from "../../../api/usuario";
import "./UsuarioCreateForm.scss";

export function UsuarioCreateForm({ onUserActions }) {
  const { auth } = useAuth();
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formValue, { resetForm }) => {
      try {
        await createUsuarioApi(auth.token, formValue);
        toast.success("Usuario agregado exitosamente");
        onUserActions();
        resetForm(); // Limpia el formulario
      } catch (error) {
        toast.error("Error al agregar usuario: " + error.message);
      }
    },
  });

  return (
    <Form className="add-user-form" onSubmit={formik.handleSubmit}>
      {/* Campo de nombre */}
      <Form.Input
        name="nombre"
        placeholder="Nombre"
        value={formik.values.nombre}
        onChange={formik.handleChange}
        error={
          formik.errors.nombre
            ? { content: formik.errors.nombre, pointing: "below" }
            : null
        }
        className="add-user-form__input"
      />

      {/* Campo de apellido */}
      <Form.Input
        name="apellido"
        placeholder="Apellido"
        value={formik.values.apellido}
        onChange={formik.handleChange}
        error={
          formik.errors.apellido
            ? { content: formik.errors.apellido, pointing: "below" }
            : null
        }
        className="add-user-form__input"
      />

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
        className="add-user-form__input"
      />

      {/* Campo de contraseña (temporal) */}
      <Form.Input
        name="password"
        placeholder="Contraseña (provisional)"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={
          formik.errors.password
            ? { content: formik.errors.password, pointing: "below" }
            : null
        }
        className="add-user-form__input"
      />

      {/* Campo de rol */}
      <Form.Select
        name="rol"
        placeholder="Seleccione el Rol del usuario"
        options={[
          { key: "admin", value: "admin", text: "Admin" },
          { key: "superadmin", value: "cliente", text: "Super Admin" },
          { key: "staff", value: "staff", text: "Staff" },
        ]}
        value={formik.values.rol}
        onChange={(_, data) => formik.setFieldValue("rol", data.value)}
        error={
          formik.errors.rol
            ? { content: formik.errors.rol, pointing: "below" }
            : null
        }
        className="add-user-form__input"
      />

      {/* Campo de es activo */}
      <Form.Select
        name="es_activo"
        placeholder="Seleccione el estado del usuario"
        options={[
          { key: "activo", value: true, text: "Activo" },
          { key: "no_activo", value: false, text: "No activo" },
        ]}
        value={formik.values.es_activo}
        onChange={(_, data) => formik.setFieldValue("es_activo", data.value)}
        error={
          formik.errors.es_activo
            ? { content: formik.errors.es_activo, pointing: "below" }
            : null
        }
        className="add-user-form__input"
      />

      {/* Botón para enviar */}
      <Button
        type="submit"
        content="Agregar Usuario"
        primary
        fluid
        className="add-user-form__button"
      />
    </Form>
  );
}

// Valores iniciales para Formik
function initialValues() {
  return {
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "",
    es_activo: "",
  };
}

// Esquema de validación con Yup
function validationSchema() {
  return {
    nombre: Yup.string().required("Debe proporcionar un nombre"),
    apellido: Yup.string().required("Debe proporcionar un apellido"),
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("Debe proporcionar un correo electrónico"),
    password: Yup.string()
      .required("Debe proporcionar una contraseña (provisional)")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    rol: Yup.string().required("El rol es obligatorio"),
    es_activo: Yup.boolean()
      .required("Debe especificar si el usuario está activo")
      .oneOf([true, false], "El valor debe ser verdadero o falso"),
  };
}
