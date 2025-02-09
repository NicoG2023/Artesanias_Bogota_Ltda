import { API_SERVICIO_CLIENTES } from "../utils/constants";

// api/pago.js
export async function crearCheckoutSessionApi(
  token,
  items,
  applyDiscount,
  discountPercentage,
  shippingCost,
  selectedAddress,
  total,
  userId
) {
  try {
    const body = {
      items,
      applyDiscount,
      discountPercentage,
      shippingCost,
      selectedAddress,
      total,
      userId,
    };

    const response = await fetch(
      `${API_SERVICIO_CLIENTES}/api/pagos/checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al crear la sesión de pago: ${response.statusText}`
      );
    }
    return await response.json(); // { sessionId: "cs_test_123" }
  } catch (error) {
    console.error("Error en crearCheckoutSessionApi", error);
    throw error;
  }
}
