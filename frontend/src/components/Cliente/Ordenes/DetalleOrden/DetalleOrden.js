import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import "primeicons/primeicons.css";
import "./DetalleOrden.scss";

export function DetalleOrden({
  orderNumber = "451234",
  items = [
    {
      name: "Product Name",
      variant: "Blue | Medium",
      quantity: 1,
      price: 12.0,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J6qvj54IxyitNK00V7nCbXWexnN5q8.png",
    },
    {
      name: "Product Name",
      variant: "Yellow | Large",
      quantity: 1,
      price: 24.0,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J6qvj54IxyitNK00V7nCbXWexnN5q8.png",
    },
  ],
  shippingAddress = {
    name: "Celeste Slater",
    address: "606-3727 Ullamcorper, Roseville NH 11523",
    phone: "(786) 713-8616",
  },
  payment = {
    type: "Visa Debit Card",
    lastFour: "1234",
  },
  summary = {
    subtotal: 36.0,
    shipping: 5.0,
    tax: 4.0,
    total: 41.0,
  },
}) {
  return (
    <Card className="detalle-orden">
      <div className="detalle-orden__content">
        <p className="detalle-orden__thanks">Thanks!</p>
        <h1 className="detalle-orden__title">
          Detalle de la Orden <i className="pi pi-rocket"></i>
        </h1>
        <p className="detalle-orden__info">
          Your order is on the way. It'll be shipped today. We'll inform you.
        </p>

        <div className="detalle-orden__header">
          <div className="detalle-orden__order-number">
            <span>Order number:</span>
            <span className="order-number">{orderNumber}</span>
          </div>
          <div className="detalle-orden__actions">
            <Button label="Details" className="p-button-outlined" />
            <Button
              label="Print"
              className="p-button-outlined"
              icon="pi pi-print"
            />
          </div>
        </div>

        <Divider className="detalle-orden__divider" />

        <div className="detalle-orden__items">
          {items.map((item, index) => (
            <div key={index} className="detalle-orden__item">
              <Image
                src={item.image || "/placeholder.svg"}
                size="small"
                className="detalle-orden__item-image"
              />
              <div className="detalle-orden__item-details">
                <h3>{item.name}</h3>
                <p>{item.variant}</p>
                <p>Quantity {item.quantity}</p>
              </div>
              <p className="detalle-orden__item-price">
                ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="detalle-orden__details">
          <div className="detalle-orden__shipping">
            <h3>Shipping Address</h3>
            <p>{shippingAddress.name}</p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.phone}</p>
          </div>
          <div className="detalle-orden__payment">
            <h3>Payment</h3>
            <div className="payment-info">
              <div className="payment-logo">VISA</div>
              <div className="payment-details">
                <p>{payment.type}</p>
                <p>**** **** **** {payment.lastFour}</p>
              </div>
            </div>
          </div>
          <Card className="detalle-orden__summary">
            <h3>Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${summary.shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${summary.tax.toFixed(2)}</span>
              </div>
              <Divider className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}
