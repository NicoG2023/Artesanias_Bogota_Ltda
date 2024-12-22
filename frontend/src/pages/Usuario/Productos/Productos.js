import React from "react";
import { CuadriculaProductos, PanelFiltrado } from "../../../components";
import "./Productos.scss";

export function Productos() {
  return (
    <div className="main-content">
      <aside className="sidebar">
        <PanelFiltrado />
      </aside>
      <main className="content">
        <CuadriculaProductos />
      </main>
    </div>
  );
}
