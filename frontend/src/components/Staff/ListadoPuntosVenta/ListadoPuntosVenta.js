import React, { useState, useEffect } from "react";
import { Dropdown, Loader, Message, Header } from "semantic-ui-react";

export function ListadoPuntosVenta({ puntoVentaHook }) {
  const { puntosVenta, loading, error, getPuntosVenta } = puntoVentaHook;
  const [puntoVentaSeleccionado, setPuntoVentaSeleccionado] = useState(null);

  useEffect(() => {
    getPuntosVenta();
  }, [getPuntosVenta]);

  const handlePuntoVentaChange = (e, { value }) => {
    setPuntoVentaSeleccionado(value);
  };

  const opcionesDropdown = puntosVenta.map((pv) => ({
    key: pv.id,
    value: pv.id,
    text: pv.nombre, // Lo que se mostrará en el dropdown
  }));

  if (loading) {
    return (
      <Loader active inline="centered" content="Cargando puntos de venta..." />
    );
  }

  if (error) {
    return (
      <Message negative>
        <Message.Header>Error al cargar puntos de venta</Message.Header>
        <p>{error.message}</p>
      </Message>
    );
  }
  return (
    <div>
      <Header as="h2">Selecciona un punto de venta</Header>
      <Dropdown
        placeholder="Elige un punto de venta"
        selection
        options={opcionesDropdown}
        value={puntoVentaSeleccionado}
        onChange={handlePuntoVentaChange}
      />

      {/* Ejemplo: Mostramos el punto de venta seleccionado */}
      {puntoVentaSeleccionado && (
        <Message info>
          Punto de venta seleccionado:{" "}
          {
            // Podemos mostrar el nombre, si queremos un extra step:
            //   buscar en `puntosVenta` el que coincida con `puntoVentaSeleccionado`
            puntosVenta.find((pv) => pv.id === puntoVentaSeleccionado)?.nombre
          }
        </Message>
      )}
    </div>
  );
}
