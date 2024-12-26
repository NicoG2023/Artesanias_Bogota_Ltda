import { useState, useEffect } from "react";
import { obtenerProductosApi, obtenerFiltrosApi } from "../api/productos";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    categoria: null,
    color: null,
    minPrecio: 0,
    maxPrecio: 100000000,
  });

  // Función para cargar productos
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await obtenerProductosApi(filters);
      setProductos([...data.data]); // Asegura inmutabilidad
      setPagination({ ...data.pagination }); // Asegura inmutabilidad
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar filtros
  const fetchFiltros = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerFiltrosApi();
      setCategorias(data.categorias);
      setColores(data.colores);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar productos cuando los filtros cambian
  useEffect(() => {
    fetchProductos();
  }, [filters]);

  // Efecto para cargar los filtros al montar el componente
  useEffect(() => {
    fetchFiltros();
  }, []);

  // Función para actualizar los filtros
  const updateFilters = (newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };
    setFilters(updatedFilters); // Esto debería disparar el useEffect
  };

  return {
    productos,
    pagination,
    loading,
    error,
    updateFilters,
    categorias,
    colores,
  };
}
