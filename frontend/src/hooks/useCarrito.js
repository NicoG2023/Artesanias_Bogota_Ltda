import { useState, useEffect } from "react";
import {
  obtenerCarritoApi,
  agregarAlCarritoApi,
  actualizarCantidadCarritoApi,
  eliminarDelCarritoApi,
} from "../api/carrito";

export function useCarrito() {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCarrito();
  }, []);

  // Cargar el carrito al iniciar
  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const data = await obtenerCarritoApi();
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
      const nuevoProducto = await agregarAlCarritoApi(productoId, cantidad);
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
      const productoActualizado = await actualizarCantidadCarritoApi(itemId, cantidad);
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
      await eliminarDelCarritoApi(itemId);
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
