import React, { useState } from "react";
import { Pagination } from "semantic-ui-react";
import { ModalProducto } from "../ModalProducto/ModalProducto";
import "./CuadriculaProductos.scss";

export function CuadriculaProductos({ productosHook }) {
  const {
    productos = [],
    loading,
    error,
    pagination = { pages: 1, page: 1 },
    updateFilters,
  } = productosHook;

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (loading) return <p className="loading">Cargando productos...</p>;
  if (error) {
    return (
      <p className="error">Error: {error.message || "Ha ocurrido un error"}</p>
    );
  }

  const manejarCambioPagina = (e, { activePage }) => {
    updateFilters({ page: activePage });
  };

  const totalPages = pagination.pages || 1;
  const activePage = pagination.page || 1;

  const handleOpenModal = (producto) => {
    setSelectedProduct(producto);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="product-grid">
      {productos.map((producto) => {
        // Chequeo de stock
        const isOutOfStock = producto.stock === 0;
        return (
          <div
            key={producto.id}
            className={`product-card ${isOutOfStock ? "no-stock" : ""}`}
            onClick={() => handleOpenModal(producto)}
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="product-image"
            />
            <div className="product-info">
              <h3>{producto.nombre}</h3>
              <p className="price">${producto.precio.toFixed(2)}</p>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`star ${i < producto.rating ? "filled" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <div className="pagination-container">
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            activePage={activePage}
            onPageChange={manejarCambioPagina}
            boundaryRange={1}
            siblingRange={2}
            firstItem={{ content: "Inicio", icon: "angle double left" }}
            lastItem={{ content: "Final", icon: "angle double right" }}
            prevItem={{ content: "Anterior", icon: "angle left" }}
            nextItem={{ content: "Siguiente", icon: "angle right" }}
          />
        )}
      </div>

      <ModalProducto
        open={open}
        onClose={handleCloseModal}
        producto={selectedProduct}
      />
    </div>
  );
}
