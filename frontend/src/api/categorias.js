import { API_SERVICIO_ADMIN } from "../utils/constants";

export async function agregarCategoriasApi(token, categorias) {
  const url = `${API_SERVICIO_ADMIN}/api/categorias/agregar-categorias`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ categorias }),
    });

    if (!response.ok) {
      throw new Error(`Error al agregar categorías: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en agregarCategoriasApi", error);
    throw error;
  }
}

export async function descargarPlantillaCategoriasApi() {
  const url = `${API_SERVICIO_ADMIN}/api/categorias/plantilla`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al descargar plantilla: ${response.statusText}`);
    }
    // Convertimos la respuesta a un Blob para poder forzar la descarga
    const blob = await response.blob();

    // Crear un link "invisible" y forzar su click
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "plantilla_categorias.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error en descargarPlantillaCategoriasApi", error);
    throw error;
  }
}

export async function obtenerCategoriasApi(token) {
  const url = `${API_SERVICIO_ADMIN}/api/categorias/obtener-categorias`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerCategoriasApi", error);
    throw error;
  }
}

export async function agregarCategoriaApi(token, nombre) {
  const url = `${API_SERVICIO_ADMIN}/api/categorias/agregar-categoria`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      throw new Error(`Error al agregar categoría: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en agregarCategoriaApi", error);
    throw error;
  }
}

export async function actualizarCategoriaApi(token, id, nombre) {
  const url = `${API_SERVICIO_ADMIN}/api/categorias/actualizar-categoria/${id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar categoría: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarCategoriaApi", error);
    throw error;
  }
}

export async function eliminarCategoriaApi(token, id) {
  const url = `${API_SERVICIO_ADMIN}/api/categorias/eliminar-categoria/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar categoría: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en eliminarCategoriaApi", error);
    throw error;
  }
}

export async function relacionarProductoCategoriaApi(
  token,
  productoId,
  categoriaId
) {
  const url = `${API_SERVICIO_ADMIN}/api/categorias/relacionar-producto-categoria`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productoId, categoriaId }),
    });

    if (!response.ok) {
      throw new Error(
        `Error al relacionar producto con categoría: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en relacionarProductoCategoriaApi", error);
    throw error;
  }
}
