import React from "react";
import "./CartaProducto.scss";

export function CartaProducto({ producto, onClick }) {
  const isOutOfStock = producto.stock === 0;
  const fullStars = Math.floor(producto.rating); // Número de estrellas llenas
  const hasHalfStar = producto.rating % 1 >= 0.5; // Determina si hay media estrella

  return (
    <div
      className={`product-card ${isOutOfStock ? "no-stock" : ""}`}
      onClick={() => onClick && onClick(producto)}
    >
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="product-image"
      />

      <div className="product-info">
        {/* Nombre del Producto */}
        <h3 className="product-name">{producto.nombre}</h3>

        {/* Rating */}
        <div className="rating-container">
          <div className="stars">
            {[...Array(fullStars)].map((_, i) => (
              <span key={i} className="star filled" />
            ))}
            {hasHalfStar && <span className="star half" />}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <span key={`empty-${i}`} className="star" />
            ))}
          </div>
          <span className="rating-number">{producto.rating.toFixed(1)}/5</span>
        </div>

        {/* Precio */}
        <p className="price">${producto.precio}</p>
      </div>
    </div>
  );
}
