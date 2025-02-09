import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { EnvioOrden } from "../EnvioOrden";
import "primeicons/primeicons.css";
import "./DetalleOrden.scss";

export function DetalleOrden({ order }) {
  if (!order) return <p>Cargando orden...</p>;

  const {
    id: orderNumber,
    estado,
    total,
    descuento_aplicado,
    fecha_orden,
    pago,
    puntoVenta,
    productosOrden,
    direccion,
  } = order;

  const formatoColombiano = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("es-CO", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const totalVal = parseFloat(total) || 0;
  const descuentoVal = parseFloat(descuento_aplicado) || 0;

  let subtotalVal = totalVal;
  let discountAmount = 0;
  if (descuentoVal > 0) {
    subtotalVal = totalVal / (1 - descuentoVal / 100);
    discountAmount = subtotalVal - totalVal;
  }

  const pagoFecha = pago?.fecha_pago
    ? formatDate(pago.fecha_pago)
    : "No disponible";
  const pagoEstado = pago?.estado ?? "Desconocido";

  return (
    <Card className="detalle-orden">
      <div className="detalle-orden__content">
        <p className="detalle-orden__thanks">¡Gracias por tu compra!</p>

        <h1 className="detalle-orden__title">
          Detalle de la Orden <i className="pi pi-rocket"></i>
        </h1>

        <p className="detalle-orden__info">
          Tu pedido está en estado: <strong>{estado}</strong>
        </p>

        <div className="detalle-orden__header">
          <div className="detalle-orden__order-number">
            <span>Número de Orden:</span>
            <span className="order-number">{orderNumber}</span>
            <span>Fecha de la Orden:</span>
            <span className="order-number">{formatDate(fecha_orden)}</span>
          </div>
          <div className="detalle-orden__actions">
            <Button label="Detalles" className="p-button-outlined" />
            <Button
              label="Imprimir"
              className="p-button-outlined"
              icon="pi pi-print"
            />
          </div>
        </div>

        <Divider className="detalle-orden__divider" />

        {/* Listado de items */}
        <div className="detalle-orden__items">
          {productosOrden.map((item, index) => (
            <div key={index} className="detalle-orden__item">
              <Image
                src={item.productoImagen || "/placeholder.svg"}
                size="small"
                className="detalle-orden__item-image"
              />
              <div className="detalle-orden__item-details">
                <h3>{item.productoNombre}</h3>
                <p>Cantidad: {item.cantidad}</p>
              </div>
              <p className="detalle-orden__item-price">
                {formatoColombiano(item.productoPrecio * 1000)}
              </p>
            </div>
          ))}
        </div>

        <div className="detalle-orden__details">
          {/* Sección de envío */}
          <div className="detalle-orden__shipping">
            <h3>Dirección de Envío</h3>
            {direccion ? (
              <>
                <p>{direccion.direccion}</p>
                <p>
                  {direccion.ciudad}, {direccion.departamento}, {direccion.pais}
                </p>
                <p>{direccion.codigo_postal}</p>
                {direccion.info_adicional && <p>{direccion.info_adicional}</p>}
              </>
            ) : (
              <p>Sin dirección</p>
            )}
          </div>

          {/* Info de pago */}
          <div className="detalle-orden__payment">
            <h3>Pago</h3>
            <div className="payment-info">
              <div className="payment-logo">VISA</div>
              <div className="payment-details">
                <p>Fecha de pago: {pagoFecha}</p>
                <p>Estado: {pagoEstado.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Sección Lugar */}
          <div className="detalle-orden__place">
            <h3>Lugar</h3>
            <p>
              Compra realizada en:{" "}
              <strong>{puntoVenta?.nombre || "Desconocido"}</strong>
            </p>
          </div>

          {/* Resumen de costos */}
          <Card className="detalle-orden__summary">
            <h3>Resumen</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatoColombiano(subtotalVal)}</span>
              </div>

              {descuentoVal > 0 && (
                <div className="summary-row">
                  <span>Descuento ({descuentoVal}%)</span>
                  <span>- {formatoColombiano(discountAmount)}</span>
                </div>
              )}

              <Divider className="summary-divider" />

              <div className="summary-row total">
                <span>Total</span>
                <span>{formatoColombiano(totalVal)}</span>
              </div>
            </div>
          </Card>
        </div>
        <EnvioOrden ordenId={orderNumber} currentEstado={estado} />
      </div>
    </Card>
  );
}
