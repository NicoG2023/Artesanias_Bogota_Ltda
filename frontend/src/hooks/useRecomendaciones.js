import { useState, useCallback } from "react";
import { getProductosRecomendadosApi } from "../api/recomendaciones";
import { useAuth } from "./useAuth";

export function useRecomendaciones() {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProductosRecomendados = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProductosRecomendadosApi(
        auth.token,
        auth.user.id
      );
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  return {
    data,
    loading,
    error,
    getProductosRecomendados,
  };
}
