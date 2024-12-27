import React from "react";
import { CuadriculaProductos, PanelFiltrado } from "../../../components";
import { useProductos } from "../../../hooks/useProducto";
import "./Productos.scss";

export function Productos() {
  const productosHook = useProductos();
  return (
    <div className="main-content">
      <aside className="sidebar">
        <PanelFiltrado productosHook={productosHook} />
      </aside>
      <main className="content">
        <CuadriculaProductos productosHook={productosHook} />
      </main>
    </div>
  );
}
