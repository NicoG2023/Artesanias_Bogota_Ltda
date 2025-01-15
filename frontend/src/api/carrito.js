import { API_SERVICIO_ADMIN } from "../utils/constants";

// Obtener el carrito del usuario
export async function obtenerCarritoApi() {
  const url = `${API_SERVICIO_ADMIN}/api/carrito`;

  try {
    const response = await fetch(url);
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
export async function agregarAlCarritoApi(productoId, cantidad) {
  const url = `${API_SERVICIO_ADMIN}/api/carrito`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!response.ok) {
      throw new Error(`Error al agregar producto al carrito: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en agregarAlCarritoApi", error.message);
    throw error;
  }
}

// Actualizar la cantidad de un producto en el carrito
export async function actualizarCantidadCarritoApi(itemId, cantidad) {
  const url = `${API_SERVICIO_ADMIN}/api/carrito/${itemId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cantidad }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar la cantidad del carrito: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en actualizarCantidadCarritoApi", error.message);
    throw error;
  }
}

// Eliminar un producto del carrito
export async function eliminarDelCarritoApi(itemId) {
  const url = `${API_SERVICIO_ADMIN}/api/carrito/${itemId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar producto del carrito: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en eliminarDelCarritoApi", error.message);
    throw error;
  }
}
