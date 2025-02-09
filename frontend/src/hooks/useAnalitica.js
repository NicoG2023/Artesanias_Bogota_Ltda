import { useState, useCallback } from "react";
import { getEmpleadosConMasVentasApi } from "../api/analitica";
import { useAuth } from "./useAuth";

export function useAnalitica() {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return {
    data,
    loading,
    error,
    getEmpleadosConMasVentas,
  };
}
