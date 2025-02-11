import React, { useEffect } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { useOrdenes } from "../../../hooks/useOrdenes";
import { DetalleOrden } from "../../../components";

export function DetalleOrdenEnvio() {
  const location = useLocation();
  const { orden, loading, error, getOrdenPorSessionId } = useOrdenes();

  useEffect(() => {
    // 1) Parsear la querystring, p.e. ?session_id=cs_test_123
    const query = queryString.parse(location.search);
    console.log("query", query);
    console.log("query.session_id", query.session_id);
    if (query.session_id) {
      // 2) Llamar al hook para obtener la orden por sessionId
      getOrdenPorSessionId(query.session_id);
    }
  }, [location.search, getOrdenPorSessionId]);

  console.log("orden", orden);

  if (loading) return <p>Cargando la orden...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!orden) return <p>No se encontró la orden</p>;

  // 3) Si tenemos orden, mostrar los datos (ejemplo: un componente <DetalleOrden>)
  return (
    <div className="detalle-orden-page">
      <DetalleOrden order={orden} />
    </div>
  );
}
