import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Button, Dropdown, Segment, Header, Checkbox } from "semantic-ui-react";
import { useAnalitica } from "../../../hooks";
import { useAuth } from "../../../hooks/useAuth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./TotalVentas.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function TotalVentas() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [isAnnual, setIsAnnual] = useState(false);
  const [queryTriggered, setQueryTriggered] = useState(false);

  const { data, loading, error, getTotalVentas } = useAnalitica();
  const { auth } = useAuth();

  const handleFetchData = () => {
    setQueryTriggered(true);
    getTotalVentas(isAnnual ? null : month, year);
  };

  const monthOptions = [
    { key: 1, text: "Enero", value: 1 },
    { key: 2, text: "Febrero", value: 2 },
    { key: 3, text: "Marzo", value: 3 },
    { key: 4, text: "Abril", value: 4 },
    { key: 5, text: "Mayo", value: 5 },
    { key: 6, text: "Junio", value: 6 },
    { key: 7, text: "Julio", value: 7 },
    { key: 8, text: "Agosto", value: 8 },
    { key: 9, text: "Septiembre", value: 9 },
    { key: 10, text: "Octubre", value: 10 },
    { key: 11, text: "Noviembre", value: 11 },
    { key: 12, text: "Diciembre", value: 12 },
  ];

  const yearOptions = [];
  for (let y = currentYear; y >= currentYear - 5; y--) {
    yearOptions.push({ key: y, text: y.toString(), value: y });
  }

  return (
    <div className="total-ventas-container">
      <Header as="h2" textAlign="center">
        Analítica de Ventas Totales
      </Header>
      <Segment className="selector-container">
        <Checkbox
          toggle
          label="Ver Datos Anuales"
          checked={isAnnual}
          onChange={() => setIsAnnual(!isAnnual)}
        />

        {!isAnnual && (
          <Dropdown
            placeholder="Seleccionar mes"
            selection
            options={monthOptions}
            value={month}
            onChange={(e, { value }) => setMonth(value)}
          />
        )}

        <Dropdown
          placeholder="Seleccionar año"
          selection
          options={yearOptions}
          value={year}
          onChange={(e, { value }) => setYear(value)}
        />

        <Button primary onClick={handleFetchData}>
          Consultar
        </Button>
      </Segment>

      {loading && <div className="loading">Cargando datos...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && queryTriggered && data.length === 0 && (
        <div className="no-data">
          No hay datos para el período seleccionado.
        </div>
      )}

      {!loading && data && (
        <div className="chart-container">
          {isAnnual ? (
            <>
              <Bar
                data={{
                  labels: data.map((item) => item.mes),
                  datasets: [
                    {
                      label: "Ventas Mensuales",
                      data: data.map((item) => parseFloat(item.total_ventas)),
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: {
                      display: true,
                      text: `Ventas Mensuales - Año ${year}`,
                    },
                  },
                }}
              />
              <div className="total-ventas">
                <strong>Total Anual:</strong> {data.reduce((acc, item) => acc + parseFloat(item.total_ventas), 0)}
              </div>
            </>
          ) : (
            <div className="total-ventas">
              <strong>Total Ventas del Mes:</strong> {data.length > 0 ? data[0].total_ventas : 0}
            </div>
          )}
        </div>
      )}
    </div>
  );
}