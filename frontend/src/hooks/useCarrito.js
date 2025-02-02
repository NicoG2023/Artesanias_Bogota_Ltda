import { useState, useEffect, useRef } from "react";
import {
  obtenerCarritoApi,
  agregarAlCarritoApi,
  actualizarCantidadCarritoApi,
  eliminarDelCarritoApi,
} from "../api/carrito";
import { useAuth } from "./useAuth";

export function useCarrito() {
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [carrito, setCarrito] = useState({
    id: null,
    usuario_fk: null,
    productos: [],
  });
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.token && auth?.user?.id && !hasFetched.current) {
      console.log("Cargando carrito...");
      hasFetched.current = true;
      cargarCarrito();
    }
  }, [auth?.token, auth?.user?.id]);

  const limpiarError = () => setError(null);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      limpiarError();
      if (!auth?.token || !auth?.user?.id)
        throw new Error("Usuario no autenticado");
      const data = await obtenerCarritoApi(auth.token, auth.user.id);
      if (data && Array.isArray(data.productos)) {
        setCarrito(data);
      } else {
        setError("No se pudo cargar el carrito");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async (productoId, cantidad) => {
    try {
      setLoading(true);
      limpiarError();
      const nuevoProducto = await agregarAlCarritoApi(
        auth.token,
        productoId,
        cantidad
      );

      setCarrito((prevCarrito) => {
        const productoExistente = prevCarrito.productos.find(
          (p) => p.id === nuevoProducto.id
        );
        const nuevosProductos = productoExistente
          ? prevCarrito.productos.map((p) =>
              p.id === nuevoProducto.id
                ? { ...p, cantidad: p.cantidad + cantidad }
                : p
            )
          : [...prevCarrito.productos, { ...nuevoProducto, cantidad }];

        return { ...prevCarrito, productos: nuevosProductos };
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
      limpiarError();
      await actualizarCantidadCarritoApi(
        auth.token,
        auth.user.id,
        itemId,
        cantidad
      );

      setCarrito((prevCarrito) => ({
        ...prevCarrito,
        productos: prevCarrito.productos.map((item) =>
          item.id === itemId ? { ...item, cantidad } : item
        ),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (itemId) => {
    try {
      setLoading(true);
      limpiarError();
      await eliminarDelCarritoApi(auth.token, auth.user.id, itemId);

      setCarrito((prevCarrito) => ({
        ...prevCarrito,
        productos: prevCarrito.productos.filter((item) => item.id !== itemId),
      }));
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
    limpiarError,
  };
}
