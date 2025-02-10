import { useState, useCallback } from "react";
import {
  obtenerCategoriasApi,
  agregarCategoriaApi,
  actualizarCategoriaApi,
  eliminarCategoriaApi,
  relacionarProductoCategoriaApi,
} from "../api/categorias";
import { useAuth } from "./useAuth";

export function useCategoria() {
  const { auth } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener todas las categorías
   */
  const obtenerCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const result = await obtenerCategoriasApi(auth.token);
      setCategorias(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  /**
   * Agregar una nueva categoría
   */
  const agregarCategoria = useCallback(
    async (nombre) => {
      try {
        setLoading(true);
        await agregarCategoriaApi(auth.token, nombre);
        await obtenerCategorias(); // Refrescar lista
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token, obtenerCategorias]
  );

  /**
   * Actualizar una categoría por ID (solo cambia el nombre)
   */
  const actualizarCategoria = useCallback(
    async (id, nombre) => {
      try {
        setLoading(true);
        await actualizarCategoriaApi(auth.token, id, nombre);
        await obtenerCategorias(); // Refrescar lista
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token, obtenerCategorias]
  );

  /**
   * Eliminar una categoría por ID
   */
  const eliminarCategoria = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await eliminarCategoriaApi(auth.token, id);
        await obtenerCategorias(); // Refrescar lista
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token, obtenerCategorias]
  );

  /**
   * Relacionar un producto con una categoría
   */
  const relacionarProductoCategoria = useCallback(
    async (productoId, categoriaId) => {
      try {
        setLoading(true);
        await relacionarProductoCategoriaApi(
          auth.token,
          productoId,
          categoriaId
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  return {
    categorias,
    loading,
    error,
    obtenerCategorias,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    relacionarProductoCategoria,
  };
}
