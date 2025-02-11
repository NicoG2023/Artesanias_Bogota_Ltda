import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { CartaProducto } from "../CartaProducto";
import { ModalProducto } from "../ModalProducto";
import { useRecomendaciones } from "../../../hooks/useRecomendaciones";
import "./CarruselProductos.scss";

export function CarruselProductos() {
  const { data, loading, error, getProductosRecomendados } =
    useRecomendaciones();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getProductosRecomendados();
  }, [getProductosRecomendados]);

  const productTemplate = (producto) => (
    <CartaProducto
      key={producto.id}
      producto={producto}
      onClick={() => {
        setSelectedProduct(producto);
        setModalOpen(true);
      }}
    />
  );

  if (loading) return <p>Cargando recomendaciones...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No hay productos recomendados.</p>;
  console.log("data del carrusel", data);
  return (
    <div className="carrusel-productos">
      <h2>Te podría interesar</h2>
      <Carousel
        value={data}
        numVisible={3}
        numScroll={1}
        itemTemplate={productTemplate}
        circular
        autoplayInterval={5000}
      />

      <ModalProducto
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        producto={selectedProduct}
        puntoVentaId={1} // Puedes pasarlo dinámicamente según la lógica de tu app
      />
    </div>
  );
}
