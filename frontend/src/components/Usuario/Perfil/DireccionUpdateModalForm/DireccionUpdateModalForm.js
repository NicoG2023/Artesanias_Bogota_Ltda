import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Dropdown } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { updateDireccionApi } from "../../../../api/direcciones";
import AddressInput from "../DireccionCreateModalForm/AddressInput";
import { departamentos } from "../DireccionCreateModalForm/Departamentos";
import { ciudades } from "../DireccionCreateModalForm/Ciudades";
import "./DireccionUpdateModalForm.scss";

export function DireccionUpdateModalForm({ open, direccion, onClose, onUserActions }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentDireccion, setCurrentDireccion] = useState(null);

  useEffect(() => {
    if (direccion) {
      setCurrentDireccion(direccion);
    } else {
      setCurrentDireccion(null);
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

  const validationSchema = Yup.object().shape({
    tipoCalle: Yup.string().required("Debe seleccionar un tipo de calle"),
    nombreCalle: Yup.string().required("Debe proporcionar el nombre de la calle"),
    numeroPrincipal: Yup.string()
      .required("Debe proporcionar el número principal")
      .matches(/^[0-9]/, "Debe comenzar con un número"),
    numeroSecundario: Yup.string()
      .required("Debe proporcionar el número secundario")
      .matches(/^[0-9]/, "Debe comenzar con un número"),
    ciudad: Yup.string().required("Debe seleccionar una ciudad"),
    departamento: Yup.string().required("Debe seleccionar un departamento"),
    codigo_postal: Yup.string().matches(/^\d{5}$/, "Debe ser un código postal válido"),
    info_adicional: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      tipoCalle: direccionComponents.tipoCalle || "",
      nombreCalle: direccionComponents.nombreCalle || "",
      numeroPrincipal: direccionComponents.numeroPrincipal || "",
      numeroSecundario: direccionComponents.numeroSecundario || "",
      departamento: currentDireccion?.departamento || "",
      ciudad: currentDireccion?.ciudad || "",
      codigo_postal: currentDireccion?.codigo_postal || "",
      info_adicional: currentDireccion?.info_adicional || ""
    },
    validationSchema,
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
          departamento: formValue.departamento,
          ciudad: formValue.ciudad,
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

  const handleDepartamentoChange = (_, { value }) => {
    formik.setFieldValue("departamento", value);
    formik.setFieldValue("ciudad", "");
  };

  return (
    <Modal open={open} onClose={onClose} size="small" closeIcon>
      <Modal.Header>Actualizar Dirección</Modal.Header>
      <Modal.Content>
        <Form className="update-direccion-form" onSubmit={formik.handleSubmit}>
          <AddressInput formik={formik} />

          <Form.Field>
            <Dropdown
              selection
              search
              name="departamento"
              placeholder="Seleccione Departamento"
              options={departamentos}
              value={formik.values.departamento}
              onChange={handleDepartamentoChange}
              error={formik.errors.departamento && formik.touched.departamento}
              fluid
            />
          </Form.Field>

          <Form.Field>
            <Dropdown
              selection
              search
              name="ciudad"
              placeholder="Seleccione Ciudad"
              options={ciudades[formik.values.departamento] || []}
              value={formik.values.ciudad}
              onChange={(_, { value }) => formik.setFieldValue("ciudad", value)}
              error={formik.errors.ciudad && formik.touched.ciudad}
              disabled={!formik.values.departamento}
              fluid
            />
          </Form.Field>

          <Form.Input
            name="codigo_postal"
            placeholder="Código Postal"
            value={formik.values.codigo_postal}
            onChange={formik.handleChange}
            error={formik.errors.codigo_postal ? { content: formik.errors.codigo_postal, pointing: "below" } : null}
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
        <Button 
        className="btn-actualizar-direccion"
          type="submit" 
          onClick={formik.handleSubmit} 
          primary 
          loading={loading}
          disabled={loading || !formik.isValid}
        >
          {loading ? "Actualizando..." : "Actualizar Dirección"}
        </Button>
        <Button className="btn-cancelar"onClick={onClose} secondary>Cancelar</Button>
      </Modal.Actions>
    </Modal>
  );
}


