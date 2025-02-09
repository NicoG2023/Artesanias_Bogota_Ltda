import React from "react";
import {
  CuadriculaProductos,
  PanelFiltrado,
  Buscador,
} from "../../../components";
import { useProductos } from "../../../hooks/useProducto";
import "./Productos.scss";

export function Productos() {
  const productosHook = useProductos();

  // Función que invocaremos desde el Buscador
  const handleSearch = (searchTerm) => {
    // Llamamos al hook para actualizar el "search" en nuestros filtros
    productosHook.updateFilters({ search: searchTerm, page: 1 });
    // Nota: también puedes resetear la paginación a 1 (page: 1) si lo deseas
  };

  return (
    <div className="products-page">
      {/* Contenedor para el Buscador, centrado */}
      <div className="buscador-container">
        <Buscador onSearch={handleSearch} />
      </div>

      <div className="main-content">
        <aside className="sidebar">
          <PanelFiltrado productosHook={productosHook} />
        </aside>
        <main className="content">
          <CuadriculaProductos productosHook={productosHook} puntoVentaId={1} />
        </main>
      </div>
    </div>
  );
}
