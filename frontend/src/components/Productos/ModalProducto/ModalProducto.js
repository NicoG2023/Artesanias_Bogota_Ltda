import React from "react";
import { Modal, Button, Icon, Message } from "semantic-ui-react";
import "./ModalProducto.scss";

export function ModalProducto({ open, onClose, producto }) {
  if (!producto) return null;

  const handleAddToCart = () => {
    console.log("Agregar al carrito:", producto);
    // Lógica para agregar al carrito
  };

  const renderRating = () => {
    const stars = [];
    for (let i = 0; i < producto.rating; i++) {
      stars.push(<Icon key={i} name="star" color="yellow" />);
    }
    return stars.length ? stars : "Sin valoración";
  };

  const sinStock = producto.stock === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="large"
      className="modal-product"
      closeIcon
    >
      <Modal.Content>
        <div className="modal-product__content">
          <div className="modal-product__image-container">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="modal-product__image"
            />
          </div>

          <div className="modal-product__details">
            <h2 className="modal-product__title">{producto.nombre}</h2>
            <p className="modal-product__price">
              Precio: ${producto.precio?.toFixed(2)}
            </p>
            <p className="modal-product__description">{producto.descripcion}</p>
            <p>Color: {producto.color}</p>
            <div className="modal-product__rating">
              Rating: {renderRating()}
            </div>

            {/* Mostrar stock y/o mensaje de sin stock */}
            {sinStock ? (
              <Message negative>
                <Message.Header>Sin stock</Message.Header>
                <p>No hay unidades disponibles en este punto de venta.</p>
              </Message>
            ) : (
              <p>Unidades disponibles: {producto.stock}</p>
            )}

            <div className="modal-product__footer">
              <Button
                color="green"
                onClick={handleAddToCart}
                disabled={sinStock}
              >
                <Icon name="cart" />
                {sinStock ? "No disponible" : "Agregar al carrito"}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}
