import { useState, useEffect } from "react";
import {
  obtenerCarritoApi,
  agregarAlCarritoApi,
  actualizarCantidadCarritoApi,
  eliminarDelCarritoApi,
} from "../api/carrito";
import { useAuth } from "./useAuth";

export function useCarrito() {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    cargarCarrito();
  }, []);

  // Cargar el carrito al iniciar
  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const data = await obtenerCarritoApi(auth.token, auth?.user?.id);
      setCarrito(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Agregar un producto al carrito
  const agregarProducto = async (productoId, cantidad) => {
    try {
      setLoading(true);
      const nuevoProducto = await agregarAlCarritoApi(
        auth.token,
        productoId,
        cantidad
      );
      setCarrito((prev) => [...prev, nuevoProducto]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar la cantidad de un producto en el carrito
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

  // Eliminar un producto del carrito
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
