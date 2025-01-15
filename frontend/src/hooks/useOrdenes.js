// src/hooks/useOrdenes.js

import { useState, useCallback } from "react";
import { obtenerOrdenesPorUsuarioApi, obtenerOrdenesApi } from "../api/ordenes";
import { useAuth } from "./useAuth";

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para paginación
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
  });

  // Estado para el término de búsqueda (solo aplica a `getOrdenes`)
  const [searchTerm, setSearchTerm] = useState("");

  // Obtenemos token y user del hook de autenticación
  const { auth } = useAuth();

  /**
   * Cargar TODAS las órdenes (con paginación y filtro)
   * Exclusivo para admins o roles con acceso global.
   */
  const getOrdenes = useCallback(
    async (desiredPage = 1, term = "") => {
      if (!auth?.token) return;

      setLoading(true);
      setError(null);

      try {
        // Llamada a la API para obtener todas las órdenes
        const response = await obtenerOrdenesApi(auth.token, desiredPage, term);

        setOrdenes(response.data || []);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            total: response.pagination.total,
            pages: response.pagination.pages,
          });
        } else {
          setPagination({ page: 1, total: 0, pages: 0 });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  /**
   * Cargar órdenes del USUARIO autenticado (paginadas)
   * Exclusivo para clientes o usuarios con acceso limitado a sus propias órdenes.
   */
  const getOrdenesPorUsuario = useCallback(
    async (desiredPage = 1) => {
      if (!auth?.token || !auth?.user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await obtenerOrdenesPorUsuarioApi(
          auth.user.id,
          auth.token,
          desiredPage
        );

        setOrdenes(response.data || []);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            total: response.pagination.total,
            pages: response.pagination.pages,
          });
        } else {
          setPagination({ page: 1, total: 0, pages: 0 });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  /**
   * Cambiar de página para TODAS las órdenes
   */
  const goToPage = useCallback(
    (newPage) => {
      setPage(newPage);
      getOrdenes(newPage, searchTerm);
    },
    [getOrdenes, searchTerm]
  );

  /**
   * Cambiar de página para las órdenes del usuario
   */
  const goToPageForUser = useCallback(
    (newPage) => {
      setPage(newPage);
      getOrdenesPorUsuario(newPage);
    },
    [getOrdenesPorUsuario]
  );

  /**
   * Actualizar término de búsqueda
   * Reinicia la página y vuelve a cargar todas las órdenes filtradas.
   */
  const onChangeSearchTerm = useCallback(
    (newTerm) => {
      setSearchTerm(newTerm);
      setPage(1);
      getOrdenes(1, newTerm);
    },
    [getOrdenes]
  );

  return {
    // Estados comunes
    ordenes,
    loading,
    error,
    page,
    pagination,
    searchTerm,

    // Métodos específicos
    getOrdenes, // Cargar TODAS las órdenes
    getOrdenesPorUsuario, // Cargar órdenes del usuario autenticado
    goToPage, // Cambiar página para TODAS las órdenes
    goToPageForUser, // Cambiar página para órdenes del usuario
    onChangeSearchTerm, // Cambiar término de búsqueda
  };
}
