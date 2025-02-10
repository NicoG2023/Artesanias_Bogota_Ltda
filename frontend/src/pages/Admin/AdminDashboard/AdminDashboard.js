import React from "react";
import {
  EmpleadosConMasDineroGenerado,
  EmpleadosConMasVentas,
  ProductosMasVendidos,
  ClientesConMasCompras,
} from "../../../components";
import "./AdminDashboard.scss";

export function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Dashboard de Staff</h1>
      <div className="dashboard-container">
        <div className="panel">
          <EmpleadosConMasDineroGenerado />
        </div>
        <div className="panel">
          <EmpleadosConMasVentas />
        </div>
        <div className="panel">
          <ProductosMasVendidos />
        </div>
        <div className="panel">
          <ClientesConMasCompras />
        </div>
      </div>
    </div>
  );
}
