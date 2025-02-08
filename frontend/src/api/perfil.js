import { API_SERVICIO_USUARIOS } from "../utils/constants";

export async function updateNombreApellidoApi(token, formValue) {
  try {
      const url = `${API_SERVICIO_USUARIOS}/api/perfil/update-nombre-apellido`; 
      const params = {
          method: "PUT",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formValue),
      };
      const response = await fetch(url, params);

      if (!response.ok) {
          // Si el código de estado no es 2xx, lanzar error con la respuesta del servidor
          const errorData = await response.json();
          throw new Error(errorData.message || "Error en la solicitud");
      }

      return await response.json();
  } catch (error) {
      console.error("Error en updateNombreApellidoApi:", error);
      throw error;
  }
}

  
export async function updateEmailApi(token, formValue) {
    try {
        const url = `${API_SERVICIO_USUARIOS}/api/perfil/update-email`;
        const params = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nuevoEmail: formValue.email }),
        };

        const response = await fetch(url, params);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el email');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}
  
export async function updatePasswordApi(token, formValue) {
    try {
      const url = `${API_SERVICIO_USUARIOS}/api/perfil/update-password`;
      const params = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nuevaContrasena: formValue.password
        }),
      };
      
      const response = await fetch(url, params);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
}
  