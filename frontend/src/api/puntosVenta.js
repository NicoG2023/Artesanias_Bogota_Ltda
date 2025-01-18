import { API_SERVICIO_CLIENTES } from "../utils/constants";

export async function obtenerPuntosDeVentaApi(token) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/puntos-venta`;
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
        `Error al obtener los puntos de venta: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerPuntosDeVentaApi", error.message);
    throw error;
  }
}
