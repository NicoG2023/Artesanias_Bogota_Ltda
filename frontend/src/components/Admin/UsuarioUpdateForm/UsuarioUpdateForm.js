import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks";
import { updateUsuarioApi } from "../../../api/usuario";
import "./UsuarioUpdateForm.scss";


export function UsuarioUpdateForm({ usuario, onClose, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false); // Estado para manejar el loading


  const formik = useFormik({
    initialValues: initialValues(usuario),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formValue) => {
      setLoading(true);
      try {
        await updateUsuarioApi(auth.token, usuario.id, formValue);
        toast.success("Usuario actualizado exitosamente");
        onUserActions();
        onClose();
      } catch (error) {
        toast.error("Error al actualizar usuario: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });


  return (
    <Form className="update-user-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        name="nombre"
        placeholder="Nombre"
        value={formik.values.nombre}
        onChange={formik.handleChange}
        error={formik.errors.nombre ? { content: formik.errors.nombre, pointing: "below" } : null}
        className="update-user-form__input"
      />
      <Form.Input
        name="apellido"
        placeholder="Apellido"
        value={formik.values.apellido}
        onChange={formik.handleChange}
        error={formik.errors.apellido ? { content: formik.errors.apellido, pointing: "below" } : null}
        className="update-user-form__input"
      />
      <Form.Input
        name="email"
        placeholder="Correo Electrónico"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.errors.email ? { content: formik.errors.email, pointing: "below" } : null}
        className="update-user-form__input"
      />
      <Form.Input
        name="puntos_descuento"
        placeholder="Puntos de descuento"
        value={formik.values.puntos_descuento}
        onChange={formik.handleChange}
        error={formik.errors.puntos_descuento ? { content: formik.errors.puntos_descuento, pointing: "below" } : null}
        className="update-user-form__input"
      />
      <Form.Select
        name="rol"
        placeholder="Seleccione el Rol del usuario"
        options={[
          { key: "admin", value: "admin", text: "Admin" },
          { key: "cliente", value: "cliente", text: "Cliente" },
          { key: "staff", value: "staff", text: "Staff" },
        ]}
        value={formik.values.rol}
        onChange={(_, data) => formik.setFieldValue("rol", data.value)}
        error={formik.errors.rol ? { content: formik.errors.rol, pointing: "below" } : null}
        className="update-user-form__input"
      />
      <Form.Select
        name="es_activo"
        placeholder="Seleccione el estado del usuario"
        options={[
          { key: "activo", value: true, text: "Activo" },
          { key: "no_activo", value: false, text: "No activo" },
        ]}
        value={formik.values.es_activo}
        onChange={(_, data) => formik.setFieldValue("es_activo", data.value)}
        error={formik.errors.es_activo ? { content: formik.errors.es_activo, pointing: "below" } : null}
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
    nombre: usuario.nombre || "",
    apellido: usuario.apellido || "",
    email: usuario.email || "",
    puntos_descuento: usuario.puntos_descuento || "",
    rol: usuario.rol || "",
    es_activo: usuario.es_activo || "",
  };
}

// Esquema de validación con Yup
function validationSchema() {
  return {
    nombre: Yup.string().required("Debe proporcionar un nombre"),
    apellido: Yup.string().required("Debe proporcionar un apellido"),
    email: Yup.string().email("Correo electrónico no válido").required("Debe proporcionar un correo electrónico"),
    puntos_descuento: Yup.number().required("Debe proporcionar los puntos de descuento").min(0, "Los puntos de descuento no pueden ser negativos"),
    rol: Yup.string().required("El rol es obligatorio"),
    es_activo: Yup.boolean().required("Debe especificar si el usuario está activo").oneOf([true, false], "El valor debe ser verdadero o falso"),
  };
}

