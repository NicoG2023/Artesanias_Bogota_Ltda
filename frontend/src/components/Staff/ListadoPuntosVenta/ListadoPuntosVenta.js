import React, { useState, useEffect } from "react";
import { Dropdown, Loader, Message, Header } from "semantic-ui-react";
import "./ListadoPuntosVenta.scss"

export function ListadoPuntosVenta({ puntoVentaHook, onSelectPuntoVenta }) {
  const { puntosVenta, loading, error, getPuntosVenta } = puntoVentaHook;
  const [puntoVentaSeleccionado, setPuntoVentaSeleccionado] = useState(null);

  useEffect(() => {
    getPuntosVenta();
  }, [getPuntosVenta]);

  const handlePuntoVentaChange = (e, { value }) => {
    console.log("Valor seleccionado en Dropdown:", value);
    setPuntoVentaSeleccionado(value);
    // Avisamos al padre que se eligió un nuevo punto de venta
    if (onSelectPuntoVenta) {
      onSelectPuntoVenta(value);
    }
  };

  const opcionesDropdown = puntosVenta.map((pv) => ({
    key: pv.id,
    value: pv.id,
    text: pv.nombre,
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
    <div className="listado-puntos-venta">
      <Header as="h2" className="listado-puntos-venta__header">Selecciona un punto de venta</Header>
      <Dropdown
        className="listado-puntos-venta__dropdown"
        placeholder="Elige un punto de venta"
        selection
        options={opcionesDropdown}
        value={puntoVentaSeleccionado}
        onChange={handlePuntoVentaChange}
      />

      {puntoVentaSeleccionado && (
        <Message info>
          Punto de venta seleccionado:{" "}
          {puntosVenta.find((pv) => pv.id === puntoVentaSeleccionado)?.nombre}
        </Message>
      )}
    </div>
  );
}
