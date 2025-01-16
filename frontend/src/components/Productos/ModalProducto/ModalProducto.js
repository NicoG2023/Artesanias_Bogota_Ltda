import React from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import { useCarrito } from "../../../hooks/useCarrito";
import "./ModalProducto.scss";

export function ModalProducto({ open, onClose, producto }) {
  
  const { agregarProducto } = useCarrito();

  if (!producto) return null;

  const handleAddToCart = async () =>  {
    
    // Lógica para agregar al carrito
    try {
      // Agregar el producto al carrito con una cantidad fija (por ejemplo, 1)
      console.log("Agregar al carrito:", producto);
      await agregarProducto(producto.id, 1);
      console.log("Producto agregado al carrito:", producto);
      onClose(); // Cierra el modal después de agregar al carrito
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error.message);
    }

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
