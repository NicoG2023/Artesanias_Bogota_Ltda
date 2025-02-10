import React, { useState } from "react";
import {
  CuadriculaProductos,
  PanelFiltrado,
  Buscador,
  CarruselProductos,
} from "../../../components";
import { useProductos } from "../../../hooks/useProducto";
import { useAuth } from "../../../hooks";
import { Button } from "semantic-ui-react";
import { motion } from "framer-motion";
import "./Productos.scss";

export function Productos() {
  const { auth } = useAuth();
  const productosHook = useProductos();
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);

  // Función que invocaremos desde el Buscador
  const handleSearch = (searchTerm) => {
    productosHook.updateFilters({ search: searchTerm, page: 1 });
  };

  return (
    <div className="products-page">
      <div className="buscador-container">
        <Buscador onSearch={handleSearch} />
      </div>

      <div className="main-content">
        <aside className="sidebar">
          <PanelFiltrado productosHook={productosHook} />
        </aside>

        <main className="content">
          {/* Botón para activar el Carrusel */}
          {auth?.user && auth?.user?.rol === "cliente" && (
            <>
              <Button
                className="toggle-recommendations-btn"
                onClick={() =>
                  setMostrarRecomendaciones(!mostrarRecomendaciones)
                }
              >
                {mostrarRecomendaciones
                  ? "Ocultar Recomendaciones"
                  : "Ver Recomendaciones"}
              </Button>

              {/* Animación para mostrar el Carrusel */}
              <motion.div
                className="recomendaciones-container"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: mostrarRecomendaciones ? "auto" : 0,
                  opacity: mostrarRecomendaciones ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {mostrarRecomendaciones && <CarruselProductos />}
              </motion.div>
            </>
          )}

          {/* Cuadrícula de Productos */}
          <CuadriculaProductos productosHook={productosHook} puntoVentaId={1} />
        </main>
      </div>
    </div>
  );
}
