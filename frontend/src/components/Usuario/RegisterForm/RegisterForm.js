import React, { useState } from "react";
import { Button, Form, Icon, Checkbox, Message } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerApi } from "../../../api/usuario";
import { toast } from "react-toastify";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      if (!formData.termsAccepted) {
        formik.setFieldError(
          "termsAccepted",
          "Debe aceptar los terminos y condiciones."
        );
        return;
      }
      try {
        await registerApi(formData);
        toast.success(
          "Registro exitoso, verifica tu correo para activar tu cuenta."
        );
        console.log("Usuario registrado");
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <Form className="register-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        name="email"
        placeholder="Correo Electronico"
        className="register-form__input"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.errors.email ? { content: formik.errors.email } : null}
      />
      <Form.Input
        name="nombre"
        placeholder="Nombres"
        className="register-form__input"
        value={formik.values.first_name}
        onChange={formik.handleChange}
        error={
          formik.errors.first_name
            ? { content: formik.errors.first_name }
            : null
        }
      />
      <Form.Input
        name="apellido"
        placeholder="Apellidos"
        className="register-form__input"
        value={formik.values.last_name}
        onChange={formik.handleChange}
        error={
          formik.errors.last_name ? { content: formik.errors.last_name } : null
        }
      />
      <Form.Input
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Contraseña"
        className="register-form__input"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={
          formik.errors.password ? { content: formik.errors.password } : null
        }
        icon={
          <Icon
            name={showPassword ? "eye slash" : "eye"}
            link
            onClick={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Form.Input
        name="confirmPassword"
        type="password"
        className="register-form__input"
        placeholder="Confirmar Contraseña"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        error={
          formik.errors.confirmPassword
            ? { content: formik.errors.confirmPassword }
            : null
        }
      />
      <Form.Field>
        <Checkbox
          label={
            <label>
              Acepto los{" "}
              <a
                href="/terminos-y-condiciones"
                target="_blank"
                className="register-form__links"
              >
                términos y condiciones
              </a>
            </label>
          }
          name="termsAccepted"
          checked={formik.values.termsAccepted}
          onChange={(e, { checked }) =>
            formik.setFieldValue("termsAccepted", checked)
          }
          className={formik.errors.termsAccepted ? "error" : ""}
        />
        {formik.errors.termsAccepted && (
          <Message
            error
            content={formik.errors.termsAccepted}
            className="ui error message"
          />
        )}
      </Form.Field>
      <Button
        type="submit"
        content="Registrarse"
        className="register-form__button"
        primary
        fluid
      />
    </Form>
  );
}

function initialValues() {
  return {
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    privacyPolicy: false,
  };
}

function validationSchema() {
  return {
    email: Yup.string()
      .email("Correo electronico no valido")
      .required("Correo electronico es obligatorio"),
    nombre: Yup.string().required("Primer nombre es obligatorio"),
    apellido: Yup.string().required("Apellidos son obligatorios"),
    password: Yup.string().required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Debe confirmar la contraseña"),
    termsAccepted: Yup.bool().oneOf(
      [true],
      "Debe aceptar los términos y condiciones"
    ),
  };
}
