// useCarrito.js
import { useState, useEffect } from "react";
import {
  obtenerCarritoApi,
  agregarAlCarritoApi,
  actualizarCantidadCarritoApi,
  eliminarDelCarritoApi,
} from "../api/carrito";
import { useAuth } from "./useAuth";

export function useCarrito() {
  const [loading, setLoading] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    cargarCarrito();
  }, [auth?.token]);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const data = await obtenerCarritoApi(auth.token, auth?.user?.id);
      setCarrito(Array.isArray(data) ? data : []); // Actualizamos el carrito global
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async (productoId, cantidad) => {
    try {
      setLoading(true);
      const nuevoProducto = await agregarAlCarritoApi(
        auth.token,
        productoId,
        cantidad
      );
      setCarrito((prev) => {
        if (Array.isArray(prev)) {
          return [...prev, nuevoProducto]; // Usar prev solo si es un array
        } else {
          return [nuevoProducto]; // Si no es un array, retorna solo el nuevo producto
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarProducto = async (itemId, cantidad) => {
    try {
      setLoading(true);
      const productoActualizado = await actualizarCantidadCarritoApi(
        auth.token,
        itemId,
        cantidad
      );
      setCarrito((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, ...productoActualizado } : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (itemId) => {
    try {
      setLoading(true);
      await eliminarDelCarritoApi(auth.token, itemId);
      setCarrito((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    carrito,
    loading,
    error,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    cargarCarrito,
  };
}
