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
  });

  //Funcion para cargar productos
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await obtenerProductosApi(filters);
      setProductos(data.data);
      setPagination(data.pagination);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  //Funcion para cargar filtros
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

  //Efecto para cargar productos cuando los filtros cambian
  useEffect(() => {
    fetchProductos();
  }, [filters]);

  //Efecto para cargar los filtros al montar el componente
  useEffect(() => {
    fetchFiltros();
  }, []);

  // Funcion para actualizar los filtros
  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
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
