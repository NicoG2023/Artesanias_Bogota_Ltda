import { useState, useCallback } from "react";
import { obtenerPuntosDeVentaApi } from "../api/puntosVenta";
import { useAuth } from "./useAuth";

export function usePuntoVenta() {
  const [puntosVenta, setPuntosVenta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { auth } = useAuth();

  const getPuntosVenta = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await obtenerPuntosDeVentaApi();
      setPuntosVenta(response || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { puntosVenta, loading, error, getPuntosVenta };
}
