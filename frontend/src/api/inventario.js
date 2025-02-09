import { API_SERVICIO_ADMIN } from "../utils/constants";

export async function obtenerInventarioApi(
  token,
  { page = 1, limit = 10, punto_venta_fk = null }
) {
  const baseUrl = `${API_SERVICIO_ADMIN}/api/inventario`;
  const url = new URL(baseUrl);

  url.searchParams.set("page", Number(page));
  url.searchParams.set("limit", Number(limit));
  if (punto_venta_fk) url.searchParams.set("punto_venta_fk", punto_venta_fk);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener inventario: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerInventarioApi", error);
    throw error;
  }
}

export async function agregarProductoInventarioApi(token, data) {
  // data debe contener: { productoId, cantidadInicial, puntoVentaId, nombrePuntoVenta }
  const url = `${API_SERVICIO_ADMIN}/api/inventario`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar producto al inventario: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en agregarProductoInventarioApi", error);
    throw error;
  }
}

export async function actualizarStockApi(token, sku, data) {
  // data debe contener: { cantidad, operacion, punto_venta_fk, nombre_punto_venta }
  const url = `${API_SERVICIO_ADMIN}/api/inventario/${sku}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar stock: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarStockApi", error);
    throw error;
  }
}

export async function eliminarProductoInventarioApi(token, inventarioId) {
  const url = `${API_SERVICIO_ADMIN}/api/inventario/${inventarioId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al eliminar producto del inventario: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en eliminarProductoInventarioApi", error);
    throw error;
  }
}

export async function revisarStockApi(token, productoId) {
  const url = `${API_SERVICIO_ADMIN}/api/inventario/stock/${productoId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al revisar el stock: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en revisarStockApi", error);
    throw error;
  }
}

export async function obtenerProductosNoVinculadosApi(token, punto_venta_fk) {
  const url = new URL(
    `${API_SERVICIO_ADMIN}/api/inventario/productos-disponibles`
  );
  url.searchParams.set("punto_venta_fk", punto_venta_fk);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Error al obtener productos disponibles: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerProductosNoVinculadosApi", error);
    throw error;
  }
}
