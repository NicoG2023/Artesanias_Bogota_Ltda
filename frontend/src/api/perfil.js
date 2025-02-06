import { API_SERVICIO_USUARIOS } from "../utils/constants";

export async function updateNombreApellidoApi(token, formValue) {
    try {
      const url = `${API_SERVICIO_USUARIOS}/api/usuarios/update-nombre-apellido`;
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
      return result;
    } catch (error) {
      throw error;
    }
}
  
export async function updateEmailApi(token, nuevoEmail) {
    try {
      const url = `${API_SERVICIO_USUARIOS}/api/usuarios/update-email`;
      const params = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevoEmail }),
      };
      const response = await fetch(url, params);
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
}
  
export async function updateContrasenaApi(token, nuevaContrasena) {
    try {
      const url = `${API_SERVICIO_USUARIOS}/api/usuarios/update-contrasena`;
      const params = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevaContrasena }),
      };
      const response = await fetch(url, params);
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
}
  