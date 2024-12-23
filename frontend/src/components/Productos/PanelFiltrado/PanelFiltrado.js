import React, { useState } from "react";
import { useProductos } from "../../../hooks/useProducto";
import "./PanelFiltrado.scss";

export function PanelFiltrado() {
  const { categorias, colores, updateFilters } = useProductos();
  const [filters, setFilters] = useState({
    color: null,
    minPrecio: 0,
    maxPrecio: 100000000,
  });

  // Manejo de cambio de categoría
  const manejoCambioCategoria = (categoriaId) => {
    console.log("Seleccionando categoría:", categoriaId);
    updateFilters({ categoria: categoriaId });
  };

  // Manejo de cambio de color
  const manejoCambioColor = (color) => {
    updateFilters({ color });
  };

  // Manejo de cambio de rango de precios
  const manejoCambioPrecio = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  return (
    <div className="filter-panel">
      <h2 className="filter-panel__title">Filtros</h2>

      {/* Filtro por Categoría */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__subtitle">Categoría</h3>
        {categorias.map((categoria) => (
          <div key={categoria.id} className="filter-panel__checkbox">
            <input
              type="radio"
              id={`categoria-${categoria.id}`}
              name="categoria"
              className="filter-panel__radio-input"
              onChange={() => manejoCambioCategoria(categoria.id)}
            />
            <label
              htmlFor={`categoria-${categoria.id}`}
              className="filter-panel__radio-label"
            >
              {categoria.nombre}
            </label>
          </div>
        ))}
      </div>

      {/* Filtro por Color */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__subtitle">Color</h3>
        {colores.map((color) => (
          <div key={color} className="filter-panel__checkbox">
            <input
              type="checkbox"
              id={color}
              className="filter-panel__checkbox-input"
              onChange={() => manejoCambioColor(color)}
            />
            <label htmlFor={color} className="filter-panel__checkbox-label">
              {color}
            </label>
          </div>
        ))}
      </div>

      {/* Filtro por Precio */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__subtitle">Precio</h3>
        <div className="filter-panel__price-inputs">
          <input
            type="number"
            name="minPrecio"
            placeholder="Mínimo"
            onChange={manejoCambioPrecio}
            className="filter-panel__price-input"
          />
          <input
            type="number"
            name="maxPrecio"
            placeholder="Máximo"
            onChange={manejoCambioPrecio}
            className="filter-panel__price-input"
          />
        </div>
      </div>
    </div>
  );
}
