import { API_SERVICIO_CLIENTES } from "../utils/constants";

export async function obtenerOrdenesPorUsuarioApi(userId, token, page = 1) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/mis-ordenes/${userId}?page=${page}`;
  try {
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(baseUrl, params);
    if (!response.ok) {
      throw new Error(
        `Error al obtener las ordenes del usuario: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerOrdenesPorUsuarioApi", error.message);
    throw error;
  }
}

export async function obtenerOrdenesApi(token, page = 1, searchTerm = "") {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/ordenes`;
  const url = new URL(baseUrl);

  url.searchParams.set("page", page);
  if (searchTerm) {
    url.searchParams.set("searchTerm", searchTerm);
  }
  try {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error(`Error al obtener las ordenes: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerOrdenesApi", error.message);
    throw error;
  }
}

export async function updateEstadoOrdenApi(token, ordenId, nuevoEstado) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/${ordenId}/estado`;
  try {
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    };

    const response = await fetch(baseUrl, params);
    if (!response.ok) {
      throw new Error(
        `Error al actualizar estado de la orden: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en updateEstadoOrdenApi", error.message);
    throw error;
  }
}
