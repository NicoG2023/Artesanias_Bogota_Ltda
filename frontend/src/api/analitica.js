import { API_SERVICIO_CLIENTES } from "../utils/constants";

export async function getEmpleadosConMasVentasApi(token, mes, year) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/analiticas/empleados-con-mas-ventas?month=${mes}&year=${year}`;
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
        `Error al obtener los empleados con mas ventas: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getEmpleadosConMasVentasApi", error.message);
    throw error;
  }
}
