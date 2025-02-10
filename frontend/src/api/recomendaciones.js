import { API_SERVICIO_ADMIN } from "../utils/constants";

export async function getProductosRecomendadosApi(token, userId) {
  const baseUrl = `${API_SERVICIO_ADMIN}/api/recomendaciones/${userId}`;
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
        `Error al obtener los productos recomendados: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getProductosRecomendadosApi", error.message);
    throw error;
  }
}
