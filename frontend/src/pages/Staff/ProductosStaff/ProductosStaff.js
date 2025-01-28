import React from "react";
import {
  CuadriculaProductos,
  ListadoPuntosVenta,
  Buscador,
} from "../../../components";
import { usePuntoVenta } from "../../../hooks/usePuntoVenta";
import { useProductos } from "../../../hooks";
import "./ProductosStaff.scss";

export function ProductosStaff() {
  const puntoVentaHook = usePuntoVenta();
  const productosHook = useProductos();

  // Función para manejar la selección de un punto de venta en el dropdown
  const handleSelectPuntoVenta = (puntoVentaId) => {
    // Actualizamos los filtros de productos con el punto de venta elegido
    productosHook.updateFilters({ puntoVentaId, page: 1 });
  };

  // Función que invocaremos desde el Buscador
  const handleSearch = (searchTerm) => {
    // Llamamos al hook para actualizar el "search" en nuestros filtros
    productosHook.updateFilters({ search: searchTerm, page: 1 });
    // Nota: también puedes resetear la paginación a 1 (page: 1) si lo deseas
  };

  return (
    <div className="products-page">
      <div className="filtro-punto-venta">
        {/* Pasamos la función como prop */}
        <ListadoPuntosVenta
          puntoVentaHook={puntoVentaHook}
          onSelectPuntoVenta={handleSelectPuntoVenta}
        />
      </div>
      {/* Contenedor para el Buscador, centrado */}
      <div className="buscador-container">
        <Buscador onSearch={handleSearch} />
      </div>
      <div className="cuadricula-productos">
        <CuadriculaProductos productosHook={productosHook} />
      </div>
    </div>
  );
}
