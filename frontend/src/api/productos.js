import { API_SERVICIO_ADMIN } from "../utils/constants";

export async function obtenerProductosApi({
  page = 1,
  search = "",
  categoria = null,
  color = null,
  minPrecio = 0,
  maxPrecio = 100000000,
  puntoVentaId = null,
}) {
  const baseUrl = `${API_SERVICIO_ADMIN}/api/productos`;
  const url = new URL(baseUrl);

  // Agregar parametros de consulta
  url.searchParams.set("page", page);
  if (search) url.searchParams.set("search", search);
  if (categoria) url.searchParams.set("categoria", categoria);
  if (color) url.searchParams.set("color", color);
  if (puntoVentaId) url.searchParams.set("puntoVentaId", puntoVentaId);
  if (minPrecio || maxPrecio) {
    url.searchParams.set("minPrecio", minPrecio);
    url.searchParams.set("maxPrecio", maxPrecio);
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

export async function agregarProductosBulkApi(token, productos) {
  const url = `${API_SERVICIO_ADMIN}/api/productos/bulk`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // token JWT
      },
      body: JSON.stringify({ productos }),
    });
    if (!response.ok) {
      throw new Error(`Error al crear productos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en agregarProductosBulkApi", error);
    throw error;
  }
}

export async function descargarPlantillaProductoApi() {
  const url = `${API_SERVICIO_ADMIN}/api/productos/plantilla`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al descargar plantilla: ${response.statusText}`);
    }
    // Convertir la respuesta a un Blob
    const blob = await response.blob();

    // Crear un link invisible para forzar descarga
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "plantilla_producto.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error en descargarPlantillaProductoApi:", error);
    throw error;
  }
}

export async function obtenerProductosCarouselApi() {
  const baseUrl = `${API_SERVICIO_ADMIN}/api/productos/carousel`;

  try {
    const response = await fetch(baseUrl);
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
