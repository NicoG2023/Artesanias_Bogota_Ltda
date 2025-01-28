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
  const [carrito, setCarrito] = useState({id: null, // id del carrito
    usuario_fk: null, // id del usuario
    productos: [] // Inicializar productos como un array vacío
  });
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    cargarCarrito();
  }, [auth?.token]);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      // Verificar si auth.token y auth.user.id están definidos
      if (!auth?.token || !auth?.user?.id) {
        throw new Error("Token de usuario o ID no disponible");
      }
      const data = await obtenerCarritoApi(auth.token, auth?.user?.id);
      // Verificar si la respuesta es válida y contiene los datos del carrito
      if (data && Array.isArray(data.productos)) {
        // Actualizamos el estado del carrito
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
      const nuevoProducto = await agregarAlCarritoApi(
        auth.token,
        productoId,
        cantidad
      );
      //verificación
      console.log("Estado actual del carrito:", carrito);  // Cambié 'prev' por 'carrito' para mostrar el estado actual

      // Verifica si 'nuevoProducto' tiene los datos correctos
      console.log("Producto nuevo:", nuevoProducto);

       // Asegúrate de que 'nuevoProducto' tiene los datos correctos
      setCarrito((prevCarrito) => {
        // Si ya existen productos, agregamos el nuevo, sino inicializamos el array
        const nuevosProductos = prevCarrito.productos
          ? [...prevCarrito.productos, { ...nuevoProducto, cantidad }]
          : [{ ...nuevoProducto, cantidad }];
  
        return { ...prevCarrito, productos: nuevosProductos };
      });
      //verificación
      console.log(carrito);
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
      await eliminarDelCarritoApi(auth.token, auth.user.id, itemId);
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
