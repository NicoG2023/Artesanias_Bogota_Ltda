import { useRef, useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Image, Loader, Button } from "semantic-ui-react";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { useAuth, usePago } from "../../../hooks";
import "./DetalleCarrito.scss";

export function DetalleCarrito({
  carrito,
  loading,
  error,
  eliminarProducto,
  actualizarProducto,
  cargarCarrito,
}) {
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Hook de pago (para Stripe)
  const { iniciarCheckout, loadingPago, errorPago } = usePago();

  // Estado para la dirección de envío seleccionada
  const [selectedAddress, setSelectedAddress] = useState(null);
  // Estado para definir si se aplicará el descuento
  const [aplicarDescuento, setAplicarDescuento] = useState(false);

  // Construir opciones para el dropdown a partir de las direcciones del usuario
  const shippingOptions =
    auth?.user?.direcciones?.map((direccion) => ({
      label: `${direccion.direccion}, ${direccion.ciudad}, ${direccion.departamento}`,
      value: direccion.id,
    })) || [];

  // Obtiene el descuento (puntos de descuento) del usuario, limitado a 100
  const discountPercentage = auth?.user?.puntos_descuento
    ? Math.min(auth.user.puntos_descuento, 100)
    : 0;

  // Si el descuento es 100, se aplica obligatoriamente
  useEffect(() => {
    if (discountPercentage === 100) {
      setAplicarDescuento(true);
    }
  }, [discountPercentage]);

  useEffect(() => {
    if (!hasFetched.current) {
      cargarCarrito();
      hasFetched.current = true;
    }
  }, [cargarCarrito]);

  if (loading) {
    return <Loader active inline="centered" content="Cargando carrito..." />;
  }

  if (error) {
    return <p>Error al cargar el carrito: {error}</p>;
  }

  if (!carrito.productos || carrito.productos.length === 0) {
    return <p className="carrito__vacio">El carrito está vacío</p>;
  }

  const handleEliminar = async (id) => {
    await eliminarProducto(id);
    await cargarCarrito();
  };

  const handleActualizarCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad > 0) {
      await actualizarProducto(id, nuevaCantidad);
      await cargarCarrito();
    }
  };

  // Función para formatear números a moneda colombiana
  const formatoColombiano = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Extraemos el arreglo de productos del carrito (si no existe, es un arreglo vacío)
  const productos = carrito?.productos || [];

  // Calculamos el total de ítems (sumando las cantidades)
  const totalItems = productos.reduce(
    (acc, producto) => acc + producto.REL_CarritoProducto.cantidad,
    0
  );

  // Calculamos el subtotal: sumamos (precio * cantidad) para cada producto.
  const subTotal = productos.reduce((acc, item) => {
    const precioSinPuntos = Number(item.precio.replace(/\./g, ""));
    return acc + precioSinPuntos * item.REL_CarritoProducto.cantidad;
  }, 0);

  // Costo de envío fijo en COP
  const shippingCost = 7300;

  // Calculamos el subtotal con descuento, si se aplica.
  const discountedSubTotal = aplicarDescuento
    ? subTotal - subTotal * (discountPercentage / 100)
    : subTotal;

  // Total final = Subtotal (con descuento si aplica) + costo de envío.
  const finalTotal = discountedSubTotal + shippingCost;

  // Precio original final (sin descuento)
  const originalTotal = subTotal + shippingCost;

  // ------------------------------
  // Manejo de Stripe Checkout
  // ------------------------------
  const handlePagar = () => {
    // Vamos a pasar los productos al checkout.
    // Cada "item" en Stripe Checkout: { price: "stripe_price_id", quantity: X }
    // Si un producto no tiene stripe_price_id, lo omitimos o manejamos error
    const items = productos
      .filter((p) => p.stripe_price_id) // o manejar si no existe
      .map((p) => ({
        priceId: p.stripe_price_id,
        quantity: p.REL_CarritoProducto.cantidad,
        producto_fk: p.id,
      }));

    if (!items.length) {
      alert("No hay productos válidos con stripe_price_id para pagar.");
      return;
    }

    // Llamamos a nuestro hook
    iniciarCheckout(
      items,
      aplicarDescuento,
      discountPercentage,
      shippingCost,
      selectedAddress,
      subTotal + shippingCost
    );
  };

  return (
    <div className="detalle-carrito">
      <div className="detalle-carrito__content">
        <div className="detalle-carrito__items">
          <div className="detalle-carrito__header">
            <h1>CARRITO DE COMPRAS</h1>
            <span>{totalItems} items</span>
          </div>

          {productos.map((producto) => (
            <div key={producto.id} className="cart-item">
              <Image
                src={producto.imagen || "/placeholder.svg"}
                size="tiny"
                className="cart-item__image"
              />
              <div className="cart-item__details">
                {auth?.user?.rol === "staff" && (
                  <div className="cart-item__type">
                    {producto.puntoVenta.nombre || ""}
                  </div>
                )}
                <div className="cart-item__name">{producto.nombre}</div>
                <div className="cart-item__quantity">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleActualizarCantidad(
                        producto.id,
                        producto.REL_CarritoProducto.cantidad - 1
                      )
                    }
                    disabled={
                      producto.REL_CarritoProducto.cantidad === 1 || loading
                    }
                  >
                    −
                  </button>
                  <span>{producto.REL_CarritoProducto.cantidad}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleActualizarCantidad(
                        producto.id,
                        producto.REL_CarritoProducto.cantidad + 1
                      )
                    }
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item__price">
                {formatoColombiano(Number(producto.precio.replace(/\./g, "")))}
              </div>
              <button
                className="cart-item__remove"
                onClick={() => handleEliminar(producto.id)}
              >
                ×
              </button>
            </div>
          ))}

          <button
            className="back-to-shop"
            onClick={() => navigate("/productos")}
          >
            ← Regresar a tienda
          </button>
        </div>

        <Card className="summary-card">
          <h2>RESUMEN</h2>
          {/* Si hay descuento aplicado, mostramos el "precio original" tachado */}
          {aplicarDescuento ? (
            <div className="summary-row discount-summary">
              <span>ITEMS {totalItems}</span>
              <span>
                <span className="original-price">
                  {formatoColombiano(subTotal)}
                </span>
                <span className="discounted-price">
                  {formatoColombiano(discountedSubTotal)}
                </span>
              </span>
            </div>
          ) : (
            <div className="summary-row">
              <span>ITEMS {totalItems}</span>
              <span>{formatoColombiano(subTotal)}</span>
            </div>
          )}

          {/* Sección para seleccionar la dirección de envío */}
          {auth?.user?.rol === "cliente" && (
            <div className="summary-section">
              <label>Envío</label>
              <Dropdown
                options={shippingOptions}
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.value)}
                placeholder="Seleccione dirección de envío"
                className="shipping-dropdown"
              />
            </div>
          )}

          {/* Sección de Descuentos */}
          <div className="summary-section">
            <label>Descuento</label>
            <div className="discount-info">
              <span>{discountPercentage}%</span>
              {discountPercentage < 100 && (
                <div className="discount-options">
                  <p>¿Desea aplicar este descuento o seguir acumulando?</p>
                  <Button
                    onClick={() => setAplicarDescuento(true)}
                    className="btn-discount"
                  >
                    Aplicar descuento
                  </Button>
                  <Button
                    onClick={() => setAplicarDescuento(false)}
                    className="btn-discount"
                  >
                    Seguir acumulando
                  </Button>
                </div>
              )}
              {discountPercentage === 100 && (
                <p>Descuento aplicado automáticamente</p>
              )}
            </div>
          </div>

          {aplicarDescuento ? (
            <>
              <div className="summary-row discount-summary">
                <span>Sub Total</span>
                <span>
                  <span className="original-price">
                    {formatoColombiano(subTotal)}
                  </span>
                  <span className="discounted-price">
                    {formatoColombiano(discountedSubTotal)}
                  </span>
                </span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>{formatoColombiano(shippingCost)}</span>
              </div>
              <div className="summary-total discount-summary">
                <span>Total Compra</span>
                <span>
                  <span className="original-price">
                    {formatoColombiano(originalTotal)}
                  </span>
                  <span className="discounted-price">
                    {formatoColombiano(finalTotal)}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="summary-row">
                <span>Sub Total</span>
                <span>{formatoColombiano(subTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>{formatoColombiano(shippingCost)}</span>
              </div>
              <div className="summary-total">
                <span>Total Compra</span>
                <span>{formatoColombiano(subTotal + shippingCost)}</span>
              </div>
            </>
          )}

          {/* Botón de pago que redirige a Stripe */}
          <Button
            className="register-button"
            onClick={handlePagar}
            disabled={loadingPago}
          >
            {loadingPago ? "Procesando..." : "Pagar"}
          </Button>
          {errorPago && <p>Error en pago: {errorPago}</p>}
        </Card>
      </div>
    </div>
  );
}
