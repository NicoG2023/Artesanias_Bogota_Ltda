import React, { useState, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { actualizarPuntoDeVentaApi } from "../../../../api/puntosVenta";
import "./puntosVentaUpdateForm.scss";

export function PuntosVentaUpdateForm({ puntoVenta, onClose, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPuntoVenta, setCurrentPuntoVenta] = useState(puntoVenta);

  useEffect(() => {
    setCurrentPuntoVenta(puntoVenta);
  }, [puntoVenta]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Debe proporcionar un nombre para el punto de venta"),
    tipo: Yup.string()
      .oneOf(["fisico", "online"], "El tipo debe ser 'fisico' u 'online'")
      .required("Debe seleccionar un tipo"),
    direccion: Yup.string().when('tipo', {
      is: 'fisico',
      then: () => Yup.string().required("Debe proporcionar una dirección"),
      otherwise: () => Yup.string().notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      nombre: currentPuntoVenta.nombre || "",
      tipo: currentPuntoVenta.tipo || "",
      direccion: currentPuntoVenta.tipo === "fisico" ? currentPuntoVenta.direccion || "" : "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formValue) => {
      setLoading(true);
      try {
        await actualizarPuntoDeVentaApi(auth.token, currentPuntoVenta.id, formValue);
        toast.success("Punto de venta actualizado exitosamente");
        onUserActions();
        onClose();
      } catch (error) {
        toast.error("Error al actualizar punto de venta: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleInputChange = (e, { name, value }) => {
    formik.setFieldValue(name, value);
  };

  return (
    <Form className="update-puntoVenta-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        name="nombre"
        placeholder="Nombre del Punto de Venta"
        value={formik.values.nombre}
        onChange={handleInputChange}
        error={formik.errors.nombre ? { content: formik.errors.nombre, pointing: "below" } : null}
        className="update-puntoVenta-form__input"
      />

      <Form.Select
        name="tipo"
        placeholder="Seleccione el Tipo"
        options={[
          { key: "fisico", value: "fisico", text: "Físico" },
          { key: "online", value: "online", text: "Online" },
        ]}
        value={formik.values.tipo}
        onChange={(_, data) => handleInputChange(null, data)}
        error={formik.errors.tipo ? { content: formik.errors.tipo, pointing: "below" } : null}
        className="update-puntoVenta-form__input"
      />

      {formik.values.tipo === "fisico" && (
        <Form.Input
          name="direccion"
          placeholder="Dirección (Solo para puntos físicos)"
          value={formik.values.direccion}
          onChange={handleInputChange}
          error={formik.errors.direccion ? { content: formik.errors.direccion, pointing: "below" } : null}
          className="update-puntoVenta-form__input"
        />
      )}

      <Button
        type="submit"
        content={loading ? "Actualizando..." : "Actualizar Punto de Venta"}
        primary
        fluid
        className="update-puntoVenta-form__button"
        loading={loading}
        disabled={loading}
      />
    </Form>
  );
}
