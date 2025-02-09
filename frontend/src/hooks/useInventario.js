// hooks/useInventario.js
import { useState, useEffect, useCallback } from "react";
import {
  obtenerInventarioApi,
  agregarProductoInventarioApi,
  actualizarStockApi,
  eliminarProductoInventarioApi,
  revisarStockApi,
  obtenerProductosNoVinculadosApi,
} from "../api/inventario";
import { useAuth } from "./useAuth";

export function useInventario(
  initialPage = 1,
  initialLimit = 10,
  initialPuntoVenta = null
) {
  const { auth } = useAuth();
  const [inventario, setInventario] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: initialPage,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [puntoVenta, setPuntoVenta] = useState(initialPuntoVenta);

  // Estados para productos disponibles (no vinculados)
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [loadingProductosDisponibles, setLoadingProductosDisponibles] =
    useState(false);
  const [errorProductosDisponibles, setErrorProductosDisponibles] =
    useState(null);

  // Función para obtener el inventario (con paginación y filtro por punto de venta)
  const fetchInventario = async (
    page = initialPage,
    limit = initialLimit,
    punto_venta_fk = puntoVenta
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerInventarioApi(auth.token, {
        page,
        limit,
        punto_venta_fk,
      });
      setInventario(data.inventario);
      setPagination({
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los productos NO vinculados al punto de venta
  const fetchProductosDisponibles = useCallback(async () => {
    if (!puntoVenta) return;
    setLoadingProductosDisponibles(true);
    setErrorProductosDisponibles(null);
    try {
      console.log("obteniendoProductosNoVinculados");
      const data = await obtenerProductosNoVinculadosApi(
        auth.token,
        puntoVenta
      );
      setProductosDisponibles(data.productos);
      console.log("data.productos", data.productos);
    } catch (error) {
      setErrorProductosDisponibles(error.message);
    } finally {
      setLoadingProductosDisponibles(false);
    }
  }, [auth.token, puntoVenta]);

  // Función para agregar un producto al inventario
  // data debe contener: { productoId, cantidadInicial, puntoVentaId, nombrePuntoVenta }
  const agregarProductoInventario = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await agregarProductoInventarioApi(auth.token, data);
      // Se refresca el inventario y la lista de productos disponibles
      await fetchInventario();
      await fetchProductosDisponibles();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el stock (venta o reabastecimiento)
  // data debe contener: { cantidad, operacion, punto_venta_fk, nombre_punto_venta }
  // Se utiliza "sku" como identificador en la URL
  const actualizarStock = async (sku, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await actualizarStockApi(auth.token, sku, data);
      await fetchInventario();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un producto del inventario
  // Recibe el ID del registro de inventario a eliminar
  const eliminarProductoInventario = async (inventarioId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eliminarProductoInventarioApi(
        auth.token,
        inventarioId
      );
      await fetchInventario();
      await fetchProductosDisponibles();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para revisar el stock de un producto (por productoId)
  const revisarStock = async (productoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await revisarStockApi(auth.token, productoId);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cada vez que se actualice el punto de venta se vuelve a obtener inventario y productos disponibles
  useEffect(() => {
    fetchInventario();
    fetchProductosDisponibles();
  }, [puntoVenta, fetchProductosDisponibles]);

  return {
    inventario,
    pagination,
    loading,
    error,
    fetchInventario,
    setPuntoVenta, // para actualizar el filtro de punto de venta
    agregarProductoInventario,
    actualizarStock,
    eliminarProductoInventario,
    revisarStock,
    // Nuevas propiedades para productos disponibles:
    productosDisponibles,
    loadingProductosDisponibles,
    errorProductosDisponibles,
    fetchProductosDisponibles,
    puntoVenta, // se retorna también el ID del punto de venta seleccionado
  };
}
