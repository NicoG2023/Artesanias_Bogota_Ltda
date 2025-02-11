import React from "react";
import { Form, Grid, Dropdown } from "semantic-ui-react";

const AddressInput = ({ formik }) => {
  const streetTypes = [
    { key: "avenida", value: "avenida", text: "Avenida" },
    { key: "avenida_calle", value: "avenida calle", text: "Avenida Calle" },
    { key: "avenida_carrera", value: "avenida carrera", text: "Avenida Carrera" },
    { key: "calle", value: "calle", text: "Calle" },
    { key: "carrera", value: "carrera", text: "Carrera" },
    { key: "circunvalar", value: "circunvalar", text: "Circunvalar" },
    { key: "diagonal", value: "diagonal", text: "Diagonal" },
    { key: "transversal", value: "transversal", text: "Transversal" },
  ];

  const handleNumberFirst = (e, { name }) => {
    const value = e.target.value;
    
    if (value.length === 1 && !/^[0-9]/.test(value)) {
      return;
    }

    if (value === "" || /^[0-9]/.test(value)) {
      formik.setFieldValue(name, value);
    }
  };

  return (
    <Grid columns={4} className="address-input-container">
      <Grid.Column>
        <Dropdown
          selection
          search
          name="tipoCalle"
          options={streetTypes}
          placeholder="Tipo de calle"
          value={formik.values.tipoCalle || ""}
          onChange={(_, data) => formik.setFieldValue("tipoCalle", data.value)}
          error={formik.errors.tipoCalle && formik.touched.tipoCalle}
          className="address-input"
          fluid
          portal={{
            className: 'modalSelectPortal',
            'data-calle-select': 'true'
          }}
        />
        {formik.errors.tipoCalle && formik.touched.tipoCalle && (
          <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {formik.errors.tipoCalle}
          </div>
        )}
      </Grid.Column>

      <Grid.Column>
        <Form.Input
          name="nombreCalle"
          placeholder="Nombre y sufijo"
          value={formik.values.nombreCalle || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.nombreCalle && formik.touched.nombreCalle}
          className="address-input"
          fluid
        />
      </Grid.Column>

      <Grid.Column>
        <Form.Input
          name="numeroPrincipal"
          placeholder="# Comienza con número"
          value={formik.values.numeroPrincipal ? `#${formik.values.numeroPrincipal}` : "#"}
          onChange={(e) => {
            const value = e.target.value.replace("#", "");
            handleNumberFirst(
              { target: { value } },
              { name: "numeroPrincipal" }
            );
          }}
          onBlur={formik.handleBlur}
          error={formik.errors.numeroPrincipal && formik.touched.numeroPrincipal}
          className="address-input"
          fluid
        />
      </Grid.Column>

      <Grid.Column>
        <Form.Input
          name="numeroSecundario"
          placeholder="- Comienza con número"
          value={formik.values.numeroSecundario ? `-${formik.values.numeroSecundario}` : "-"}
          onChange={(e) => {
            const value = e.target.value.replace("-", "");
            handleNumberFirst(
              { target: { value } },
              { name: "numeroSecundario" }
            );
          }}
          onBlur={formik.handleBlur}
          error={formik.errors.numeroSecundario && formik.touched.numeroSecundario}
          className="address-input"
          fluid
        />
      </Grid.Column>
    </Grid>
  );
};

export default AddressInput;