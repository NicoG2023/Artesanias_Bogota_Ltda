import { API_SERVICIO_USUARIOS } from "../utils/constants";

export async function getMeApi(token) {
  try {
    const url = `${API_SERVICIO_USUARIOS}/api/auth/me`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
