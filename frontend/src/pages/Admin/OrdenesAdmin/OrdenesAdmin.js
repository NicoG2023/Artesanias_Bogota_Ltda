import React, { useEffect } from "react";
import { TablaOrdenesAdmin } from "../../../components";
import { useOrdenes } from "../../../hooks";
import "./OrdenesAdmin.scss";

export function OrdenesAdmin() {
  const {
    ordenes,
    loading,
    error,
    page,
    pagination,
    getOrdenes,
    goToPage,
    onChangeSearchTerm,
    updateEstadoOrden,
  } = useOrdenes();

  useEffect(() => {
    getOrdenes(1, "");
  }, [getOrdenes]);

  return (
    <div>
      <h1 className="ordenes__title">Gestión de Órdenes</h1>
      <TablaOrdenesAdmin
        ordenesHook={{
          ordenes,
          loading,
          error,
          page,
          setPage: goToPage,
          pagination,
          searchTerm: "",
          setSearchTerm: onChangeSearchTerm,
          updateEstadoOrden,
        }}
      />
    </div>
  );
}
