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
