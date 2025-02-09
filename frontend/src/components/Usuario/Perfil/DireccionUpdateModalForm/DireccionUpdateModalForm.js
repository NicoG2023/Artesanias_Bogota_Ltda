import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Icon } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { updateDireccionApi } from "../../../../api/direcciones";
import AddressInput from "../DireccionCreateModalForm/AddressInput";
import "./DireccionUpdateModalForm.scss";

export function DireccionUpdateModalForm({ direccion, onClose, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentDireccion, setCurrentDireccion] = useState(null);
  
  useEffect(() => {
    if (direccion) {
      setCurrentDireccion(direccion);
    }
  }, [direccion]);

  const extractDireccionComponents = (direccionStr) => {
    if (!direccionStr) return {
      tipoCalle: "",
      nombreCalle: "",
      numeroPrincipal: "",
      numeroSecundario: ""
    };

    const direccionNormalizada = direccionStr.toLowerCase().trim().replace(/\s+/g, ' ');
    const streetTypes = [
      "avenida carrera", "avenida calle", "avenida", "carrera", "calle",
      "circunvalar", "diagonal", "transversal"
    ];

    const direccionalSuffixes = ["sur", "norte", "este", "oeste", "occidente", "oriente"].join("|");
    let tipoCalle = "", restoDireccion = direccionNormalizada;

    for (const tipo of streetTypes) {
      if (direccionNormalizada.startsWith(tipo)) {
        tipoCalle = tipo;
        restoDireccion = direccionNormalizada.slice(tipo.length).trim();
        break;
      }
    }

    if (!tipoCalle) return {
      tipoCalle: "",
      nombreCalle: "",
      numeroPrincipal: "",
      numeroSecundario: ""
    };

    const addressRegex = new RegExp(
      `^(.*?)(?:\\s*#\\s*|\\s+#?\\s*)(\\d+\\s*[a-z]?)\\s*-\\s*(\\d+[^-]*?)(?:\\s*$|\\s+(?=${direccionalSuffixes}\\b)|$)`,
      'i'
    );

    const matches = restoDireccion.match(addressRegex);

    if (matches) {
      const numeroPrincipal = matches[2].replace(/\s+/g, ' ').trim();
      const numeroSecundario = matches[3].replace(/\s+/g, ' ').trim();
      const sufijoDireccional = restoDireccion.match(new RegExp(`\\b(${direccionalSuffixes})\\b`, 'i'));
      const numeroSecundarioCompleto = sufijoDireccional ? `${numeroSecundario} ${sufijoDireccional[0]}`.trim() : numeroSecundario;
      return {
        tipoCalle,
        nombreCalle: matches[1].trim(),
        numeroPrincipal,
        numeroSecundario: numeroSecundarioCompleto
      };
    }

    return {
      tipoCalle: "",
      nombreCalle: "",
      numeroPrincipal: "",
      numeroSecundario: ""
    };
  };

  const direccionComponents = currentDireccion ? 
    extractDireccionComponents(currentDireccion.direccion) : 
    {
      tipoCalle: "",
      nombreCalle: "",
      numeroPrincipal: "",
      numeroSecundario: ""
    };

  const formik = useFormik({
    initialValues: {
      tipoCalle: direccionComponents.tipoCalle || "",
      nombreCalle: direccionComponents.nombreCalle || "",
      numeroPrincipal: direccionComponents.numeroPrincipal || "",
      numeroSecundario: direccionComponents.numeroSecundario || "",
      codigo_postal: currentDireccion?.codigo_postal || "",
      info_adicional: currentDireccion?.info_adicional || ""
    },
    validationSchema: Yup.object().shape({
      tipoCalle: Yup.string().required("Debe seleccionar un tipo de calle"),
      nombreCalle: Yup.string().required("Debe proporcionar el nombre de la calle"),
      numeroPrincipal: Yup.string().required("Debe proporcionar el número principal"),
      numeroSecundario: Yup.string().required("Debe proporcionar el número secundario"),
      codigo_postal: Yup.string().matches(/^\d{5}$/, "Debe ser un código postal válido de 5 dígitos"),
      info_adicional: Yup.string()
    }),
    enableReinitialize: true,
    onSubmit: async (formValue) => {
      if (!currentDireccion?.id) {
        toast.error("Error: No se puede actualizar la dirección sin ID");
        return;
      }

      setLoading(true);
      try {
        const direccionCompleta = `${formValue.tipoCalle} ${formValue.nombreCalle} #${formValue.numeroPrincipal}-${formValue.numeroSecundario}`;
        const datosFinales = {
          direccion: direccionCompleta,
          codigo_postal: formValue.codigo_postal,
          info_adicional: formValue.info_adicional
        };
        
        await updateDireccionApi(auth.token, currentDireccion.id, datosFinales);
        toast.success("Dirección actualizada exitosamente");
        onUserActions();
        onClose();
      } catch (error) {
        toast.error("Error al actualizar la dirección: " + (error.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    },
  });

  if (!currentDireccion) {
    return null;
  }

  return (
    <Modal open={true} onClose={onClose} size="small">
      <button className="close-button" onClick={onClose}>
        <Icon name="close" />
      </button>
      <Modal.Header>Actualizar Dirección</Modal.Header>
      <Modal.Content>
        <Form className="update-direccion-form" onSubmit={formik.handleSubmit}>
          <AddressInput formik={formik} />
          <Form.Input
            name="codigo_postal"
            placeholder="Código Postal"
            value={formik.values.codigo_postal}
            onChange={formik.handleChange}
            error={formik.touched.codigo_postal && formik.errors.codigo_postal ? 
              { content: formik.errors.codigo_postal, pointing: "below" } : null}
          />
          <Form.TextArea
            name="info_adicional"
            placeholder="Información adicional"
            value={formik.values.info_adicional}
            onChange={formik.handleChange}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} secondary>Cancelar</Button>
        <Button 
          type="submit" 
          onClick={formik.handleSubmit} 
          primary 
          loading={loading} 
          disabled={loading || !formik.isValid}
        >
          {loading ? "Actualizando..." : "Actualizar Dirección"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
