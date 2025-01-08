import React, { useEffect } from "react";
import { TablaOrdenesCliente } from "../../../components";
import { useOrdenes } from "../../../hooks";
import "./OrdenesCliente.scss";

export function OrdenesCliente() {
  const {
    ordenes,
    loading,
    error,
    page,
    pagination,
    getOrdenesPorUsuario,
    goToPageForUser,
  } = useOrdenes();

  // Cargar la primera página al montar el componente
  useEffect(() => {
    getOrdenesPorUsuario(1);
  }, [getOrdenesPorUsuario]);

  // Render
  return (
    <div>
      <h1>Mis Órdenes</h1>
      <TablaOrdenesCliente
        ordenesHook={{
          ordenes,
          loading,
          error,
          page,
          setPage: goToPageForUser, // pasamos goToPage como setPage
          pagination,
        }}
      />
    </div>
  );
}
