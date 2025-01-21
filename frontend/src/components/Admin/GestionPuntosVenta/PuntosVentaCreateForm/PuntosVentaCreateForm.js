import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { crearPuntoDeVentaApi } from "../../../../api/puntosVenta";
import "./PuntosVentaCreateForm.scss";


export function PuntosVentaCreateForm({ onUserActions }) {
  const { auth } = useAuth();


  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Debe proporcionar un nombre"),
    tipo: Yup.string()
      .required("Debe seleccionar un tipo de punto de venta")
      .oneOf(["fisico", "online"], "El tipo debe ser 'fisico' u 'online'"),
    direccion: Yup.string().when('tipo', {
      is: 'fisico',
      then: () => Yup.string().required("Debe proporcionar una dirección para puntos físicos"),
      otherwise: () => Yup.string().notRequired(),
    }),
  });


  const formik = useFormik({
    initialValues: {
      nombre: "",
      tipo: "",
      direccion: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (formValue, { resetForm }) => {
      try {
        await crearPuntoDeVentaApi(auth.token, formValue);
        toast.success("Punto de venta agregado exitosamente");
        onUserActions();
        resetForm();
      } catch (error) {
        toast.error("Error al agregar punto de venta: " + error.message);
      }
    },
  });


  return (
    <Form className="add-puntoVenta-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        name="nombre"
        placeholder="Nombre del Punto de Venta"
        value={formik.values.nombre}
        onChange={formik.handleChange}
        error={formik.errors.nombre ? { content: formik.errors.nombre, pointing: "below" } : null}
        className="add-puntoVenta-form__input"
      />


      <Form.Select
        name="tipo"
        placeholder="Seleccione el Tipo de Punto de Venta"
        options={[
          { key: "fisico", value: "fisico", text: "Físico" },
          { key: "online", value: "online", text: "Online" },
        ]}
        value={formik.values.tipo || ""}
        onChange={(_, data) => formik.setFieldValue("tipo", data.value)}
        error={formik.errors.tipo ? { content: formik.errors.tipo, pointing: "below" } : null}
        className="add-puntoVenta-form__input"
      />


      {formik.values.tipo === "fisico" && (
        <Form.Input
          name="direccion"
          placeholder="Dirección (Solo para puntos físicos)"
          value={formik.values.direccion}
          onChange={formik.handleChange}
          error={formik.errors.direccion ? { content: formik.errors.direccion, pointing: "below" } : null}
          className="add-puntoVenta-form__input"
        />
      )}


      <Button
        type="submit"
        content="Agregar Punto de Venta"
        primary
        fluid
        className="add-puntoVenta-form__button"
      />
    </Form>
  );
}







