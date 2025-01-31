import { useState, useEffect } from "react";
import {
  obtenerProductosApi,
  obtenerFiltrosApi,
  obtenerProductosCarouselApi,
} from "../api/productos";
import { useAuth } from "./useAuth";

export function useProductos() {
  const { auth } = useAuth();
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
    // Combinar con los existentes
    let updatedFilters = {
      ...filters,
      ...newFilters,
    };
    if (auth?.user?.rol === "cliente") {
      updatedFilters.puntoVentaId = 1;
    }
    setFilters(updatedFilters);
  };

  useEffect(() => {
    const fetchProductosCarousel = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerProductosCarouselApi();
        setProductos(data.data); // Guardamos los productos en el estado
      } catch (error) {
        console.error("Error al obtener productos del carousel:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductosCarousel();
  }, []);

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
