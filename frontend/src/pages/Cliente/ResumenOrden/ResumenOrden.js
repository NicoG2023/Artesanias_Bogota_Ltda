import React from "react";
import { DetalleCarrito } from "../../../components";
import { useCarrito } from "../../../hooks";

export function ResumenOrden() {
  const {
    carrito,
    loading,
    error,
    eliminarProducto,
    actualizarProducto,
    cargarCarrito,
  } = useCarrito();

  console.log("carrito", carrito);
  return (
    <div className="resumen-orden">
      <DetalleCarrito
        carrito={carrito}
        loading={loading}
        error={error}
        eliminarProducto={eliminarProducto}
        actualizarProducto={actualizarProducto}
        cargarCarrito={cargarCarrito}
      />
    </div>
  );
}
