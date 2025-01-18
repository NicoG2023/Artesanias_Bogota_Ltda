import React from "react";
import { CuadriculaProductos, ListadoPuntosVenta } from "../../../components";
import { usePuntoVenta } from "../../../hooks/usePuntoVenta";
import { useProductos } from "../../../hooks";
import "./ProductosStaff.scss";

export function ProductosStaff() {
  const puntoVentaHook = usePuntoVenta();
  const productosHook = useProductos();
  return (
    <div className="products-page">
      <div className="filtro-punto-venta">
        <ListadoPuntosVenta puntoVentaHook={puntoVentaHook} />
      </div>
      <div className="cuadricula-productos">
        <CuadriculaProductos productosHook={productosHook} />
      </div>
    </div>
  );
}
