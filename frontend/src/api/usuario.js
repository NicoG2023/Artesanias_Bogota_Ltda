import { API_SERVICIO_USUARIOS } from "../utils/constants";

export async function getMeApi(token) {
  try {
    console.log("token de user -> ", token);
    const url = `${API_SERVICIO_USUARIOS}/api/auth/me`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function loginApi(formValue) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/auth/login`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };
    const response = await fetch(url, params);

    if (response.status !== 200) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function registerApi(formValue) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/auth/register`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };
    const response = await fetch(url, params);

    if (response.status !== 201) {
      const result = await response.json();
      throw new Error(result.detail || "Error registrando usuario");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function verifyCurrentPasswordApi(token, currentPassword) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/auth/verify-password`;
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword }),
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) {
      throw new Error(result.message || "Error al verificar la contraseña");
    }

    return result;
  } catch (error) {
    throw error;
  }
}


//usuarioRoutes Api

export async function getUsuariosPagesApi(token, page = 1, limit = 10) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/usuariospage?page=${page}&limit=${limit}`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllUsuariosApi(token) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/usuarios`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getUsuarioByIdApi(token, id) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/usuario/${id}`;
    const params = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function createUsuarioApi(token, formValue) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/usuarios`;
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
        result.detail || `Error creando usuario. Código de estado: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateUsuarioApi(token, id, formValue) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/usuario/${id}`;
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
      throw new Error(result.detail || "Error actualizando usuario");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteUsuarioApi(token, id) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/usuario/${id}`;
    const params = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);

    if (response.status !== 200 && response.status !== 204) {
      const result = await response.json();
      throw new Error(result.detail || "Error eliminando usuario");
    }
    return { message: "Usuario eliminado exitosamente" };
  } catch (error) {
    throw error;
  }
}