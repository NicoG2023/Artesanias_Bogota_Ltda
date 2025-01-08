import React from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import "./ModalProducto.scss";

export function ModalProducto({ open, onClose, producto }) {
  if (!producto) return null;

  const handleAddToCart = () => {
    console.log("Agregar al carrito:", producto);
    // Lógica para agregar al carrito
  };

  const renderRating = () => {
    const stars = [];
    // Si 'rating' es un número entero, pintamos esa cantidad de estrellas
    for (let i = 0; i < producto.rating; i++) {
      stars.push(<Icon key={i} name="star" color="yellow" />);
    }
    return stars.length ? stars : "Sin valoración";
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="large"
      className="modal-product" // Clase custom para estilar
      closeIcon
    >
      <Modal.Content>
        <div className="modal-product__content">
          {/* Sección izquierda: imagen */}
          <div className="modal-product__image-container">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="modal-product__image"
            />
          </div>

          {/* Sección derecha: detalles */}
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

            {/* Footer/botón al final, centrado */}
            <div className="modal-product__footer">
              <Button color="green" onClick={handleAddToCart}>
                <Icon name="cart" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}
