import React from "react";
import {
  EmpleadosConMasDineroGenerado,
  EmpleadosConMasVentas,
} from "../../../components";
import "./StaffDashboard.scss";

export function StaffDashboard() {
  return (
    <div className="staff-dashboard">
      <h1>Dashboard de Staff</h1>
      <div className="dashboard-container">
        <div className="panel">
          <EmpleadosConMasDineroGenerado />
        </div>
        <div className="panel">
          <EmpleadosConMasVentas />
        </div>
      </div>
    </div>
  );
}
