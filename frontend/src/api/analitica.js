import { API_SERVICIO_CLIENTES } from "../utils/constants";

export async function getEmpleadosConMasDineroGeneradoApi(token, mes, year) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/analiticas/empleados-con-mas-dinero-generado?month=${mes}&year=${year}`;
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
        `Error al obtener los empleados con mas Dinero generado: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error en getEmpleadosConMasDineroGeneradoApi",
      error.message
    );
    throw error;
  }
}

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

export async function getProductosMasVendidosApi(token, mes, year) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/analiticas/productos-mas-vendidos?month=${mes}&year=${year}`;
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
        `Error al obtener los productos más vendidos: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getProductosMasVendidosApi", error.message);
    throw error;
  }
}

export async function getClientesConMasComprasApi(token, mes, year) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/analiticas/clientes-con-mas-compras?month=${mes}&year=${year}`;
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
        `Error al obtener los clientes con más compras: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getClientesConMasComprasApi", error.message);
    throw error;
  }
}

export async function getTotalVentasApi(token, mes, year) {
  const baseUrl = `${API_SERVICIO_CLIENTES}/api/analiticas/total-ventas?month=${mes}&year=${year}`;
  try{
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
        `Error al obtener el total de ventas: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getTotalVentasApi", error.message);
    throw error;
  }
}