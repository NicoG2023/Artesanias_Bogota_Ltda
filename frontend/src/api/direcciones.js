import { API_SERVICIO_USUARIOS } from "../utils/constants";

export async function createDireccionApi(token, formValue) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/perfil/direccion/create-direccion`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };
    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 201) {
      throw new Error(result.message || "Error al crear la dirección");
    }
    
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllDireccionesApi(token) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/perfil/direccion/obtener-direcciones`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, params);

    // Imprime la respuesta antes de procesarla
    const textResponse = await response.text();
    console.log("🔍 Respuesta del servidor:", textResponse);

    // Verifica si la respuesta es JSON
    try {
      const result = JSON.parse(textResponse);
      if (response.status !== 200) {
        throw new Error(result.message || "Error al obtener las direcciones");
      }
      return result;
    } catch (jsonError) {
      throw new Error("El backend devolvió un HTML en lugar de JSON.");
    }

  } catch (error) {
    console.error("Error en getAllDireccionesApi:", error);
    throw error;
  }
}

export async function getDireccionByIdApi(token, direccionId) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/perfil/direccion/${direccionId}`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) {
      throw new Error(result.message || "Error al obtener la dirección");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function updateDireccionApi(token, direccionId, formValue) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/perfil/direccion/${direccionId}`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };
    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) {
      throw new Error(result.message || "Error al actualizar la dirección");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteDireccionApi(token, direccionId) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/perfil/direccion/${direccionId}`;
    const params = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) {
      throw new Error(result.message || "Error al eliminar la dirección");
    }

    return result;
  } catch (error) {
    throw error;
  }
}
