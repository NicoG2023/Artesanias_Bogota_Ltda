import React from "react";
import { Button, Form, Modal, Dropdown, Icon } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks";
import { createDireccionApi } from "../../../../api/direcciones";
import AddressInput from "./AddressInput";
import { departamentos } from "./Departamentos";
import { ciudades } from "./Ciudades";
import "./DireccionCreateModalForm.scss";

export function DireccionCreateModalForm({ open, onClose, onDireccionCreada }) {
    const { auth } = useAuth();

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
            tipoCalle: "",
            nombreCalle: "",
            numeroPrincipal: "",
            numeroSecundario: "",
            ciudad: "",
            departamento: "",
            codigo_postal: "",
            info_adicional: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (formValue, { resetForm }) => {
            try {
                const direccionCompleta = `${formValue.tipoCalle} ${formValue.nombreCalle} #${formValue.numeroPrincipal}-${formValue.numeroSecundario}`;

                const datosFinales = {
                    direccion: direccionCompleta,
                    ciudad: formValue.ciudad,
                    departamento: formValue.departamento,
                    codigo_postal: formValue.codigo_postal,
                    info_adicional: formValue.info_adicional,
                };

                await createDireccionApi(auth.token, datosFinales);
                toast.success("Dirección agregada exitosamente");
                onDireccionCreada();
                resetForm();
                onClose();
            } catch (error) {
                toast.error("Error al agregar dirección: " + error.message);
            }
        },
    });

    const handleDepartamentoChange = (_, { value }) => {
        formik.setFieldValue("departamento", value);
        formik.setFieldValue("ciudad", "");
    };

    return (
        <Modal open={open} onClose={onClose} size="small" closeIcon>
            <Modal.Header>Agregar Dirección</Modal.Header>
            <Modal.Content>
                <Form className="add-direccion-form" onSubmit={formik.handleSubmit}>
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
                <Button className="btn-agregar-direccion" type="submit" onClick={formik.handleSubmit} primary>Agregar Dirección</Button>
                <Button className="btn-cancelar"onClick={onClose} secondary>Cancelar</Button>
            </Modal.Actions>
        </Modal>
    );
}


