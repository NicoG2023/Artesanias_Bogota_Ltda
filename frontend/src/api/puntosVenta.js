import { API_SERVICIO_CLIENTES } from "../utils/constants";

export async function obtenerPuntosDeVentaApi(token) {
  try {
    const url = `${API_SERVICIO_CLIENTES}/api/puntos-venta`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);

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

export async function obtenerPuntoDeVentaPorIdApi(token, id) {
  try {
    const url = `${API_SERVICIO_CLIENTES}/api/puntos-venta/${id}`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(
        `Error al obtener el punto de venta: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerPuntoDeVentaPorIdApi", error.message);
    throw error;
  }
}

export async function crearPuntoDeVentaApi(token, formValue) {
  try {
    const url = `${API_SERVICIO_CLIENTES}/api/puntos-venta`;
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };
    const response = await fetch(url, params);

    if (response.status !== 201) {
      const result = await response.json();
      throw new Error(
        result.detail ||
          `Error creando el punto de venta. Código: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error en crearPuntoDeVentaApi", error.message);
    throw error;
  }
}

export async function actualizarPuntoDeVentaApi(token, id, formValue) {
  try {
    const url = `${API_SERVICIO_CLIENTES}/api/puntos-venta/${id}`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };
    const response = await fetch(url, params);

    if (response.status !== 200) {
      const result = await response.json();
      throw new Error(result.detail || "Error actualizando el punto de venta");
    }

    return response.json();
  } catch (error) {
    console.error("Error en actualizarPuntoDeVentaApi", error.message);
    throw error;
  }
}

export async function eliminarPuntoDeVentaApi(token, id) {
  try {
    const url = `${API_SERVICIO_CLIENTES}/api/puntos-venta/${id}`;
    const params = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);

    if (response.status !== 200) {
      const result = await response.json();
      throw new Error(result.detail || "Error eliminando el punto de venta");
    }

    return { message: "Punto de venta eliminado correctamente" };
  } catch (error) {
    console.error("Error en eliminarPuntoDeVentaApi", error.message);
    throw error;
  }
}

export async function obtenerPuntosDeVentaPagesApi(
  token,
  page = 1,
  limit = 10
) {
  try {
    const url = `${API_SERVICIO_CLIENTES}/api/puntos-venta-page?page=${page}&limit=${limit}`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(
        `Error al obtener puntos de venta con paginación: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerPuntosDeVentaPagesApi", error.message);
    throw error;
  }
}
