const stripe = require("../../config/stripe");
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const endpointSecret =
  process.env.ENDPOINT_SECRET || "whsec_CK3u74cXsF8KNzd9TDPDe3KlIjWThr1w";
const { createOrderTransaction } = require("./OrdenController");
const { sendMessage } = require("../../kafka/kafkaProducer");
const { Pago } = require("../../models");
const { getUsuarioByEmail } = require("../../grpc/userClientGrpc");

async function createCheckoutSession(req, res) {
  try {
    // Se espera que cada item tenga: producto_fk, quantity y puntoVentaId
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
    console.log("items", items);
    const discounts = [];

    // Si se aplica descuento, crear cupón efímero
    if (applyDiscount && discountPercentage > 0) {
      const ephemeralCoupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
      });
      discounts.push({ coupon: ephemeralCoupon.id });
    }

    // Construir line_items para Stripe a partir de items
    const line_items = items.map((item) => ({
      price: item.priceId, // se asume que cada item trae su stripe_price_id como priceId
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "COP",
          product_data: {
            name: "Envío",
          },
          unit_amount: shippingCost * 100, // en centavos
        },
        quantity: 1,
      });
    }

    // Crear un arreglo de productos para la orden, incluyendo el punto de venta de cada item
    const productosCarrito = items.map((item) => ({
      producto_fk: item.producto_fk,
      cantidad: item.quantity,
      punto_venta_fk: item.puntoVentaId,
    }));

    // Obtener el array de IDs únicos de punto de venta
    const puntosVentaIds = [...new Set(items.map((item) => item.puntoVentaId))];

    // Crear la sesión de Stripe Checkout, incluyendo en metadata la info necesaria
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      discounts,
      success_url: `${frontendUrl}/detalle-orden?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pago-cancelado`,
      metadata: {
        usuario_fk: userId?.toString() || "",
        direccion_fk: selectedAddress?.toString() || null,
        discountPercentage: discountPercentage?.toString() || "0",
        total: total?.toString() || "0",
        productos: JSON.stringify(productosCarrito),
        puntos_venta_fk: JSON.stringify(puntosVentaIds),
        rol: req.user.rol,
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentIntentId = session.payment_intent;
    const paymentStatus = session.payment_status;
    const amount = session.amount_total;
    console.log("Checkout session completed:", session.id);

    // Obtener detalles adicionales del PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const paymentMethodId = paymentIntent.payment_method;
    const discountPercentage = Number(session.metadata.discountPercentage) || 0;

    // **Obtener el correo ingresado en Stripe**
    const customerEmail = session.customer_details?.email;
    let usuarioId = session.metadata.usuario_fk || null;

    // Declarar la variable para el pago de forma que esté disponible en todo el bloque
    let nuevoPago;

    if (customerEmail && session.metadata.rol === "staff") {
      console.log("Entra a vincular usuario");
      const getUsuario = {
        eventType: "VINCULAR_USUARIO",
        payload: {
          email: customerEmail,
        },
      };
      await sendMessage("usuarios-events", "VincularUsuario", getUsuario);
      console.log("Evento VINCULAR_USUARIO enviado a Kafka.");

      usuarioId = await getUsuarioByEmail(customerEmail);
      console.log("Usuario encontrado:", usuarioId);

      // Para el staff, asignamos el vendedor_fk (usando, por ejemplo, el valor de session.metadata.usuario_fk)
      nuevoPago = await Pago.create({
        usuario_fk: Number(usuarioId),
        vendedor_fk: session.metadata.usuario_fk,
        intencion_pago_id: paymentIntentId,
        metodo_pago_id: paymentMethodId,
        monto_transaccion: (amount / 100).toFixed(2),
        moneda_transaccion: session.currency.toUpperCase(),
        estado: paymentStatus,
        descripcion: "Compra en Stripe Checkout",
      });
    } else if (session.metadata.rol === "cliente") {
      // Para el cliente, no hay vendedor asociado
      nuevoPago = await Pago.create({
        usuario_fk: Number(usuarioId),
        vendedor_fk: null,
        intencion_pago_id: paymentIntentId,
        metodo_pago_id: paymentMethodId,
        monto_transaccion: (amount / 100).toFixed(2),
        moneda_transaccion: session.currency.toUpperCase(),
        estado: paymentStatus,
        descripcion: "Compra en Stripe Checkout",
      });
    } else {
      console.warn(
        "No se encontró customer_details.email en la sesión de Stripe"
      );
    }

    // Procesar los productos del carrito (cada item incluye su punto de venta)
    const productos = JSON.parse(session.metadata.productos);
    console.log("Productos en la orden:", productos);

    // Crear la orden utilizando el usuario obtenido (usuarioId) y el id del pago (nuevoPago.id)
    const nuevaOrden = await createOrderTransaction({
      usuario_fk: Number(usuarioId),
      lugar_compra_fk: JSON.parse(session.metadata.puntos_venta_fk)[0] || 1,
      pago_fk: nuevoPago.id,
      total: Number(session.metadata.total) || amount / 100,
      direccion_fk: Number(session.metadata.direccion_fk) || null,
      productos,
      stripe_session_id: session.id,
      descuento_aplicado: discountPercentage,
    });
    console.log("Orden creada:", nuevaOrden.id);

    // Agrupar los productos por punto de venta para descontar inventario
    const grupos = {};
    productos.forEach((item) => {
      const pv = item.punto_venta_fk;
      if (!grupos[pv]) {
        grupos[pv] = [];
      }
      grupos[pv].push({
        producto_fk: item.producto_fk,
        cantidad: item.cantidad,
      });
    });
    const puntosVentaGrupos = Object.entries(grupos).map(
      ([punto_venta_fk, items]) => ({
        punto_venta_fk,
        items,
      })
    );

    // Enviar evento DESCONTAR_INVENTARIO con la agrupación por punto de venta
    const inventoryPayload = {
      eventType: "DESCONTAR_INVENTARIO",
      payload: {
        puntos_venta: puntosVentaGrupos,
      },
    };
    await sendMessage("admins-events", "descontarInventario", inventoryPayload);
    console.log("Evento DESCONTAR_INVENTARIO enviado a Kafka.");

    // Enviar evento LIMPIAR_CARRITO
    const cleanCartPayload = {
      eventType: "LIMPIAR_CARRITO",
      payload: {
        usuario_fk: Number(usuarioId),
      },
    };
    await sendMessage("admins-events", "limpiarCarrito", cleanCartPayload);
    console.log("Evento LIMPIAR_CARRITO enviado a Kafka.");

    // Actualizar puntos del usuario (evento ACTUALIZAR_PUNTOS_USUARIO)
    const totalOrden = Number(session.metadata.total) || amount / 100;
    const payloadPuntos = {
      usuario_fk: Number(usuarioId),
      discountPercentage,
      total: totalOrden,
    };
    const updatePuntosMessage = {
      eventType: "ACTUALIZAR_PUNTOS_USUARIO",
      payload: payloadPuntos,
    };
    await sendMessage(
      "usuarios-events",
      "actualizarPuntos",
      updatePuntosMessage
    );
    console.log("Evento ACTUALIZAR_PUNTOS_USUARIO enviado a Kafka.");

    console.log("Orden creada y carrito limpiado");
  }

  // Responder 200 a Stripe
  return res.json({ received: true });
}

module.exports = { createCheckoutSession, stripeWebhookHandler };
