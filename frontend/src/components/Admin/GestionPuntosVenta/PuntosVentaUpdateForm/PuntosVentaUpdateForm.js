import React, { useState, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { actualizarPuntoDeVentaApi } from "../../../../api/puntosVenta";
import AddressInput from "../PuntosVentaCreateForm/AddressInput";
import "./puntosVentaUpdateForm.scss";

export function PuntosVentaUpdateForm({ puntoVenta, onClose, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPuntoVenta, setCurrentPuntoVenta] = useState(puntoVenta);

  useEffect(() => {
    setCurrentPuntoVenta(puntoVenta);
  }, [puntoVenta]);

  const extractDireccionComponents = (direccion) => {
    if (!direccion) return {};
    
    // Normalizar la dirección: convertir a minúsculas y eliminar espacios extra
    const direccionNormalizada = direccion.toLowerCase().trim().replace(/\s+/g, ' ');
    
    const streetTypes = [
      "avenida carrera",
      "avenida calle",
      "avenida",
      "carrera",
      "calle",
      "circunvalar",
      "diagonal",
      "transversal"
    ];

    const direccionalSuffixes = [
      "sur",
      "norte",
      "este",
      "oeste",
      "occidente",
      "oriente"
    ].join("|");
    
    // Encontrar el tipo de calle más largo que coincida
    let tipoCalle = "";
    let restoDireccion = direccionNormalizada;
    
    for (const tipo of streetTypes) {
      if (direccionNormalizada.startsWith(tipo)) {
        tipoCalle = tipo;
        restoDireccion = direccionNormalizada.slice(tipo.length).trim();
        break;
      }
    }
    
    if (!tipoCalle) return {};
    
    // Expresión regular para capturar el número secundario completo
    const addressRegex = new RegExp(
      `^(.*?)(?:\\s*#\\s*|\\s+#?\\s*)(\\d+\\s*[a-z]?)\\s*-\\s*(\\d+[^-]*?)(?:\\s*$|\\s+(?=${direccionalSuffixes}\\b)|$)`,
      'i'
    );
    
    const matches = restoDireccion.match(addressRegex);
    
    if (matches) {
      // Limpiamos los espacios extra en los números y sus sufijos, manteniendo el texto completo
      const numeroPrincipal = matches[2].replace(/\s+/g, ' ').trim();
      const numeroSecundario = matches[3].replace(/\s+/g, ' ').trim();
      
      // Si hay un sufijo direccional después del número secundario, lo incluimos
      const sufijoDireccional = restoDireccion.match(new RegExp(`\\b(${direccionalSuffixes})\\b`, 'i'));
      const numeroSecundarioCompleto = sufijoDireccional 
        ? `${numeroSecundario} ${sufijoDireccional[0]}`.trim()
        : numeroSecundario;
      
      return {
        tipoCalle: tipoCalle,
        nombreCalle: matches[1].trim(),
        numeroPrincipal: numeroPrincipal,
        numeroSecundario: numeroSecundarioCompleto
      };
    }
    
    return {};
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Debe proporcionar un nombre"),
    tipo: Yup.string()
      .required("Debe seleccionar un tipo de punto de venta")
      .oneOf(["fisico", "online"], "El tipo debe ser 'fisico' u 'online'"),
    tipoCalle: Yup.string().when('tipo', {
      is: 'fisico',
      then: () => Yup.string().required("Debe seleccionar un tipo de calle"),
      otherwise: () => Yup.string().notRequired(),
    }),
    nombreCalle: Yup.string().when('tipo', {
      is: 'fisico',
      then: () => Yup.string().required("Debe proporcionar el nombre de la calle"),
      otherwise: () => Yup.string().notRequired(),
    }),
    numeroPrincipal: Yup.string().when('tipo', {
      is: 'fisico',
      then: () => Yup.string()
        .required("Debe proporcionar el número principal")
        .matches(/^[0-9]/, "Debe comenzar con un número"),
      otherwise: () => Yup.string().notRequired(),
    }),
    numeroSecundario: Yup.string().when('tipo', {
      is: 'fisico',
      then: () => Yup.string()
        .required("Debe proporcionar el número secundario")
        .matches(/^[0-9]/, "Debe comenzar con un número"),
      otherwise: () => Yup.string().notRequired(),
    }),
  });

  const direccionComponents = extractDireccionComponents(currentPuntoVenta.direccion);

  const formik = useFormik({
    initialValues: {
      nombre: currentPuntoVenta.nombre || "",
      tipo: currentPuntoVenta.tipo || "",
      tipoCalle: direccionComponents.tipoCalle || "",
      nombreCalle: direccionComponents.nombreCalle || "",
      numeroPrincipal: direccionComponents.numeroPrincipal || "",
      numeroSecundario: direccionComponents.numeroSecundario || "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formValue) => {
      setLoading(true);
      try {
        const direccionCompleta = formValue.tipo === "fisico" 
          ? `${formValue.tipoCalle} ${formValue.nombreCalle} #${formValue.numeroPrincipal}-${formValue.numeroSecundario}`
          : "";

        const datosFinales = {
          nombre: formValue.nombre,
          tipo: formValue.tipo,
          direccion: direccionCompleta,
        };

        await actualizarPuntoDeVentaApi(auth.token, currentPuntoVenta.id, datosFinales);
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

  return (
    <Form className="update-puntoVenta-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        name="nombre"
        placeholder="Nombre del Punto de Venta"
        value={formik.values.nombre}
        onChange={formik.handleChange}
        error={formik.errors.nombre ? { content: formik.errors.nombre, pointing: "below" } : null}
        className="update-puntoVenta-form__input"
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
        className="update-puntoVenta-form__input"
        fluid
        selection
        portal={{
          className: 'modalSelectPortal',
          'data-tipo-select': 'true'
        }}
      />

      {formik.values.tipo === "fisico" && (
        <AddressInput formik={formik} />
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
