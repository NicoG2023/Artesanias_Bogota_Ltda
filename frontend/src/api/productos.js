import { API_SERVICIO_ADMIN } from "../utils/constants";

export async function obtenerProductosApi({
  page = 1,
  search = "",
  categoria = null,
  color = null,
  minPrecio = 0,
  maxPrecio = 100000000,
}) {
  const baseUrl = `${API_SERVICIO_ADMIN}/api/productos`;
  const url = new URL(baseUrl);

  // Agregar parametros de consulta
  url.searchParams.append("page", page);
  if (search) url.searchParams.append("search", search);
  if (categoria) url.searchParams.append("categoria", categoria);
  if (color) url.searchParams.append("color", color);
  if (minPrecio || maxPrecio) {
    url.searchParams.append("minPrecio", minPrecio);
    url.searchParams.append("maxPrecio", maxPrecio);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener los productos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerProductosApi", error.message);
    throw error;
  }
}

export async function obtenerFiltrosApi() {
  const baseUrl = `${API_SERVICIO_ADMIN}/api/productos/filtros`;
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(
        `Error al obtener los filtros de productos: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerFiltrosApi", error.message);
    throw error;
  }
}
