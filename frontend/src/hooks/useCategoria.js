import { useState, useCallback } from "react";
import {
  obtenerCategoriasApi,
  agregarCategoriaApi,
  actualizarCategoriaApi,
  eliminarCategoriaApi,
  relacionarProductoCategoriaApi,
  obtenerProductosNoRelacionadosApi,
  obtenerProductosPorCategoriaApi,
  desvincularProductoCategoriaApi,
} from "../api/categorias";
import { useAuth } from "./useAuth";

export function useCategoria() {
  const { auth } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [productosNoRelacionados, setProductosNoRelacionados] = useState([]);
  const [loadingProductosNoRelacionados, setLoadingProductosNoRelacionados] =
    useState(false);
  const [errorProductosNoRelacionados, setErrorProductosNoRelacionados] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productosPorCategoria, setProductosPorCategoria] = useState([]);
  const [loadingProductosPorCategoria, setLoadingProductosPorCategoria] =
    useState(false);
  const [errorProductosPorCategoria, setErrorProductosPorCategoria] =
    useState(null);

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

  const obtenerProductosNoRelacionados = useCallback(
    async (categoriaId) => {
      try {
        setLoadingProductosNoRelacionados(true);
        const result = await obtenerProductosNoRelacionadosApi(
          auth.token,
          categoriaId
        );
        setProductosNoRelacionados(result.data);
      } catch (err) {
        setErrorProductosNoRelacionados(err.message);
      } finally {
        setLoadingProductosNoRelacionados(false);
      }
    },
    [auth.token]
  );

  const obtenerProductosPorCategoria = useCallback(
    async (categoriaId) => {
      try {
        setLoadingProductosPorCategoria(true);
        const result = await obtenerProductosPorCategoriaApi(
          auth.token,
          categoriaId
        );
        setProductosPorCategoria(result.data);
      } catch (err) {
        setErrorProductosPorCategoria(err.message);
      } finally {
        setLoadingProductosPorCategoria(false);
      }
    },
    [auth.token]
  );

  const desvincularProductoCategoria = useCallback(
    async (productoId, categoriaId) => {
      try {
        setLoading(true);
        await desvincularProductoCategoriaApi(
          auth.token,
          productoId,
          categoriaId
        );
        await obtenerProductosPorCategoria(categoriaId); // Refrescar lista
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [auth.token, obtenerProductosPorCategoria]
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
    productosPorCategoria,
    loadingProductosPorCategoria,
    errorProductosPorCategoria,
    obtenerProductosPorCategoria,
    productosNoRelacionados,
    loadingProductosNoRelacionados,
    errorProductosNoRelacionados,
    obtenerProductosNoRelacionados,
    desvincularProductoCategoria,
  };
}
