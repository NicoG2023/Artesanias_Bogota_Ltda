import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { crearCheckoutSessionApi } from "../api/pago";
import { PUBLIC_KEY_STRIPE } from "../utils/constants";

export function usePago() {
  const [loadingPago, setLoadingPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);
  const { auth } = useAuth();
  console.log("auth", auth);

  const stripePromise = loadStripe(PUBLIC_KEY_STRIPE);

  /**
   * items es un array de objetos con { priceId, quantity }
   * applyDiscount es un boolean: si es true, aplicamos cupón
   */
  const iniciarCheckout = async (
    items,
    applyDiscount,
    discountPercentage,
    shippingCost,
    selectedAddress,
    total
  ) => {
    try {
      setLoadingPago(true);
      setErrorPago(null);

      // Llamamos al API para crear la sesión
      const data = await crearCheckoutSessionApi(
        auth.token,
        items,
        applyDiscount,
        discountPercentage,
        shippingCost,
        selectedAddress,
        total,
        auth.user.id
      );
      // data = { sessionId: "cs_test_12345" }

      if (data?.sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (error) {
          console.error("Stripe checkout error:", error);
        }
      } else {
        throw new Error("No se recibió sessionId de Stripe");
      }
    } catch (error) {
      setErrorPago(error.message);
      console.error("Error iniciando checkout:", error);
    } finally {
      setLoadingPago(false);
    }
  };

  return {
    iniciarCheckout,
    loadingPago,
    errorPago,
  };
}
