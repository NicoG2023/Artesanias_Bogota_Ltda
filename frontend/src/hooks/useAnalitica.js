import { useState, useCallback } from "react";
import {
  getEmpleadosConMasDineroGeneradoApi,
  getEmpleadosConMasVentasApi,
  getProductosMasVendidosApi,
  getClientesConMasComprasApi,
  getTotalVentasApi
} from "../api/analitica";
import { useAuth } from "./useAuth";

export function useAnalitica() {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEmpleadosConMasDineroGenerado = useCallback(
    async (month, year) => {
      try {
        setLoading(true);
        const result = await getEmpleadosConMasDineroGeneradoApi(
          auth.token,
          month,
          year
        );
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  const getEmpleadosConMasVentas = useCallback(
    async (month, year) => {
      try {
        setLoading(true);
        const result = await getEmpleadosConMasVentasApi(
          auth.token,
          month,
          year
        );
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  const getProductosMasVendidos = useCallback(
    async (month, year) => {
      try {
        setLoading(true);
        const result = await getProductosMasVendidosApi(
          auth.token,
          month,
          year
        );
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  const getClientesConMasCompras = useCallback(
    async (month, year) => {
      try {
        setLoading(true);
        const result = await getClientesConMasComprasApi(
          auth.token,
          month,
          year
        );
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  const getTotalVentas = useCallback(
    async (month, year) => {
      try {
        setLoading(true);
        const result = await getTotalVentasApi(
          auth.token,
          month,
          year
        );
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  return {
    data,
    loading,
    error,
    getEmpleadosConMasDineroGenerado,
    getEmpleadosConMasVentas,
    getProductosMasVendidos,
    getClientesConMasCompras,
    getTotalVentas
  };
}
