// pages/Inventario/Inventario.jsx
import React, { useState } from "react";
import { Button, Icon } from "semantic-ui-react";
import {
  ListadoPuntosVenta,
  TablaInventarios,
  VincularProducto,
} from "../../../components";
import { usePuntoVenta, useInventario } from "../../../hooks";
import { toast } from "react-toastify";
import "./Inventario.scss";

export function Inventario() {
  const puntoVentaHook = usePuntoVenta();
  const inventarioHook = useInventario();
  const [openVincularModal, setOpenVincularModal] = useState(false);

  // Se asume que inventarioHook.puntoVenta es el ID del punto de venta seleccionado
  const selectedPuntoVentaId = inventarioHook.puntoVenta;
  // Buscamos el nombre del punto de venta en la lista del hook de puntos de venta
  const selectedPuntoVenta = puntoVentaHook.puntosVenta.find(
    (pv) => pv.id === selectedPuntoVentaId
  );
  const selectedPuntoVentaName = selectedPuntoVenta
    ? selectedPuntoVenta.nombre
    : "";

  const handleOpenVincular = () => {
    if (!selectedPuntoVentaId) {
      toast.warning("Debe seleccionar un punto de venta antes de continuar.");
      return;
    }
    setOpenVincularModal(true);
  };
  const handleCloseVincular = () => setOpenVincularModal(false);

  // La función para vincular producto es la misma que usamos para agregar al inventario
  const vincularProducto = inventarioHook.agregarProductoInventario;

  return (
    <div className="products-page">
      <div className="filtro-punto-venta">
        {/* Al seleccionar un punto de venta se actualiza el inventario */}
        <ListadoPuntosVenta
          puntoVentaHook={puntoVentaHook}
          onSelectPuntoVenta={inventarioHook.setPuntoVenta}
        />
      </div>
      <div className="tabla-inventario">
        <div className="acciones-superiores">
          <Button className="btn-vincular" onClick={handleOpenVincular}>
            <Icon name="linkify" /> Vincular Producto
          </Button>
        </div>
        <TablaInventarios inventarioHook={inventarioHook} />
      </div>
      <VincularProducto
        open={openVincularModal}
        onClose={handleCloseVincular}
        puntoVentaId={selectedPuntoVentaId}
        nombrePuntoVenta={selectedPuntoVentaName}
        vincularProducto={vincularProducto}
        productosDisponibles={inventarioHook.productosDisponibles}
        loadingProductosDisponibles={inventarioHook.loadingProductosDisponibles}
        errorProductosDisponibles={inventarioHook.errorProductosDisponibles}
        fetchProductosDisponibles={inventarioHook.fetchProductosDisponibles}
      />
    </div>
  );
}

