import { API_SERVICIO_ADMIN } from "../utils/constants";

// Obtener el carrito del usuario
export async function obtenerCarritoApi(token, userId) {
  const url = `${API_SERVICIO_ADMIN}/api/carrito/${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error al obtener el carrito: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerCarritoApi", error.message);
    throw error;
  }
}

// Agregar un producto al carrito
export async function agregarAlCarritoApi(token, productoId, cantidad) {
  const url = `${API_SERVICIO_ADMIN}/api/carrito`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar producto al carrito: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en agregarAlCarritoApi", error.message);
    throw error;
  }
}

// Actualizar la cantidad de un producto en el carrito
export async function actualizarCantidadCarritoApi(token, itemId, cantidad) {
  const url = `${API_SERVICIO_ADMIN}/api/carrito/${itemId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cantidad }),
    });

    if (!response.ok) {
      throw new Error(
        `Error al actualizar la cantidad del carrito: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en actualizarCantidadCarritoApi", error.message);
    throw error;
  }
}

// Eliminar un producto del carrito
export async function eliminarDelCarritoApi(token, itemId) {
  const url = `${API_SERVICIO_ADMIN}/api/carrito/${itemId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      Authorization: `Bearer ${token}`,
    });

    if (!response.ok) {
      throw new Error(
        `Error al eliminar producto del carrito: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en eliminarDelCarritoApi", error.message);
    throw error;
  }
}
