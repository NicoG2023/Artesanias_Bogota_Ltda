const stripe = require("../../config/stripe");
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const endpointSecret =
  process.env.ENDPOINT_SECRET || "whsec_CK3u74cXsF8KNzd9TDPDe3KlIjWThr1w";
const { createOrderTransaction } = require("./OrdenController");
const { sendMessage } = require("../../kafka/kafkaProducer");
const { Pago } = require("../../models");

async function createCheckoutSession(req, res) {
  try {
    const {
      items,
      applyDiscount,
      discountPercentage,
      shippingCost,
      selectedAddress,
      total,
      userId,
    } = req.body;
    console.log("req.body", req.body);

    const discounts = [];

    // 1) Crear el cupón efímero si hay descuento
    if (applyDiscount && discountPercentage > 0) {
      // Creamos un cupón con porcentaje "discountPercentage"
      const ephemeralCoupon = await stripe.coupons.create({
        percent_off: discountPercentage, // entero 0 a 100
        duration: "once", // Solo para una compra
      });
      discounts.push({ coupon: ephemeralCoupon.id });
    }

    // 2) Construimos line_items a partir de items
    const line_items = items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "COP",
          product_data: {
            name: "Envío",
          },
          // unit_amount va en centavos
          unit_amount: shippingCost * 100,
        },
        quantity: 1,
      });
    }

    const productosCarrito = items.map((item) => ({
      producto_fk: item.producto_fk,
      cantidad: item.quantity,
    }));

    // 3) Creamos la sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      discounts,
      success_url: `${frontendUrl}/detalle-orden?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pago-cancelado`,
      metadata: {
        usuario_fk: userId?.toString() || "",
        direccion_fk: selectedAddress?.toString() || "",
        discountPercentage: discountPercentage?.toString() || "0",
        total: total?.toString() || "0",
        productos: JSON.stringify(productosCarrito),
        punto_venta_fk: "1",
        // Podrías incluir shippingCost, etc.
      },
    });

    return res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error al crear la sesión de Checkout:", error);
    return res.status(500).json({
      error: "No se pudo crear la sesión de pago",
      detalle: error.message,
    });
  }
}

async function stripeWebhookHandler(req, res) {
  console.log("Entra al webHook");
  let event;

  // Verificar la firma de Stripe
  const signature = req.headers["stripe-signature"];
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      endpointSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar evento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentIntentId = session.payment_intent;
    const paymentStatus = session.payment_status; // "paid", etc.
    const amount = session.amount_total; // en centavos
    const currency = session.currency;
    console.log("Checkout session completed:", session.id);

    // 1) Obtener más detalles del PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const paymentMethodId = paymentIntent.payment_method;

    // 2) Crear un Pago en tu DB
    const nuevoPago = await Pago.create({
      usuario_fk: Number(session.metadata.usuario_fk),
      intencion_pago_id: paymentIntentId,
      metodo_pago_id: paymentMethodId,
      monto_transaccion: (amount / 100).toFixed(2),
      moneda_transaccion: currency.toUpperCase(),
      estado: paymentStatus, // "paid" / "unpaid" / "canceled"
      descripcion: "Compra en Stripe Checkout",
    });

    const discountPercentage = Number(session.metadata.discountPercentage) || 0;

    // 3) Crear la Orden
    const productos = JSON.parse(session.metadata.productos);
    console.log("Productos en la orden:", productos);
    const nuevaOrden = await createOrderTransaction({
      usuario_fk: Number(session.metadata.usuario_fk),
      lugar_compra_fk: session.metadata.punto_venta_fk || 1,
      pago_fk: nuevoPago.id,
      total: Number(session.metadata.total) || amount / 100,
      direccion_fk: Number(session.metadata.direccion_fk),
      productos,
      stripe_session_id: session.id,
      descuento_aplicado: discountPercentage,
    });
    console.log("Orden creada:", nuevaOrden.id);

    // 4) Publicar evento "DESCONTAR_INVENTARIO" a Kafka
    // Supongamos que punto_venta_fk = 1 (como dices que es fijo).
    const inventoryPayload = {
      eventType: "DESCONTAR_INVENTARIO",
      payload: {
        punto_venta_fk: session.metadata.punto_venta_fk || 1,
        items: productos.map((prod) => ({
          producto_fk: prod.producto_fk,
          cantidad: prod.cantidad,
        })),
      },
    };

    await sendMessage("admins-events", "descontarInventario", inventoryPayload);
    console.log("Evento DESCONTAR_INVENTARIO enviado a Kafka.");

    const cleanCartPayload = {
      eventType: "LIMPIAR_CARRITO",
      payload: {
        usuario_fk: Number(session.metadata.usuario_fk),
      },
    };
    await sendMessage("admins-events", "limpiarCarrito", cleanCartPayload);
    console.log("Evento LIMPIAR_CARRITO enviado a Kafka");

    //ACTUALIZAR LOS PUNTOS DEL USUARIO
    const totalOrden = Number(session.metadata.total) || amount / 100; // amount/100 si no vino en metadata

    let eventTypePuntos = "ACTUALIZAR_PUNTOS_USUARIO";
    const payloadPuntos = {
      usuario_fk: Number(session.metadata.usuario_fk),
      discountPercentage,
      total: totalOrden,
    };

    // 2) Crear evento Kafka
    const updatePuntosMessage = {
      eventType: eventTypePuntos,
      payload: payloadPuntos,
    };

    // 3) Mandar a un tópico, p. ej. "usuarios-events"
    await sendMessage(
      "usuarios-events",
      "actualizarPuntos",
      updatePuntosMessage
    );
    console.log("Evento ACTUALIZAR_PUNTOS_USUARIO enviado a Kafka.");

    console.log("Orden creada y carrito limpiado");
  }

  // Responde 200 a Stripe
  return res.json({ received: true });
}

module.exports = { createCheckoutSession, stripeWebhookHandler };
