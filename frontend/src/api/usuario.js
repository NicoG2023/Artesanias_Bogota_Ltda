import { API_SERVICIO_USUARIOS } from "../utils/constants";

export async function getMeApi(token) {
  try {
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
