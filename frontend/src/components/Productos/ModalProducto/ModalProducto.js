import React from "react";
import { Modal, Button, Icon, Message, Label } from "semantic-ui-react";
import { useCarrito } from "../../../hooks/useCarrito";
import "./ModalProducto.scss";

export function ModalProducto({ open, onClose, producto, puntoVentaId }) {
  const { agregarProducto } = useCarrito();

  if (!producto) return null;

  const handleAddToCart = async () => {
    // Si no se ha seleccionado un punto de venta, avisamos al usuario
    if (!puntoVentaId) {
      alert("Debe seleccionar un punto de venta antes de agregar el producto.");
      return;
    }
    try {
      await agregarProducto(producto.id, 1, puntoVentaId);
      onClose();
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error.message);
    }
  };

  const renderRating = () => {
    const stars = [];
    for (let i = 0; i < producto.rating; i++) {
      stars.push(<Icon key={i} name="star" color="yellow" />);
    }
    return stars.length ? stars : "Sin valoración";
  };

  const renderCategorias = () => {
    return (
      <div className="modal-product__categorias">
        {producto.categorias.map((categoria) => (
          <Label key={categoria.id} className="categoria-tag">
            {categoria.nombre}
          </Label>
        ))}
      </div>
    );
  };

  const sinStock = producto.stock === 0;
  console.log("Producto:", producto);

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
            <p className="modal-product__price">Precio: ${producto.precio}</p>
            <p className="modal-product__description">{producto.descripcion}</p>
            <p className="modal-product__color">Color: {producto.color}</p>
            <div className="modal-product__rating">
              Rating: {renderRating()}
            </div>

            {/* Mostrar stock y/o mensaje de sin stock */}
            {sinStock ? (
              <Message negative className="modal-product__stock modal-product__stock--no">
                <Message.Header>Sin stock</Message.Header>
                <p>No hay unidades disponibles en este punto de venta.</p>
              </Message>
            ) : (
              <>
                <p className="modal-product__stock modal-product__stock--yes">
                  Unidades disponibles: {producto.stock}</p>
                {renderCategorias()} {/* Renderizamos las categorías aquí */}
              </>
            )}

            <div className="modal-product__footer">
              <Button
                className="btn-add-cart"
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
