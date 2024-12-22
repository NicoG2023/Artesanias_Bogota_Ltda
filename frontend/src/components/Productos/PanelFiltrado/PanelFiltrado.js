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
  const manejoCambioCategoria = (categoria) => {
    setFilters((prev) => ({ ...prev, categoria }));
    updateFilters({ categoria });
  };

  // Manejo de cambio de color
  const manejoCambioColor = (color) => {
    setFilters((prev) => ({ ...prev, color }));
    updateFilters({ color });
  };

  // Manejo de cambio de rango de precios
  const manejoCambioPrecio = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    updateFilters({
      minPrecio: filters.minPrecio,
      maxPrecio: filters.maxPrecio,
    });
  };

  return (
    <div className="filter-panel">
      <h2 className="filter-panel__title">Filtros</h2>

      {/* Filtro por Categoría */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__subtitle">Categoría</h3>
        {categorias.map((categoria) => (
          <div key={categoria} className="filter-panel__checkbox">
            <input
              type="radio"
              id={`categoria-${categoria}`}
              name="categoria"
              className="filter-panel__radio-input"
              onChange={() => manejoCambioCategoria(categoria)}
            />
            <label
              htmlFor={`categoria-${categoria}`}
              className="filter-panel__radio-label"
            >
              {categoria}
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
            value={filters.minPrecio}
            onChange={manejoCambioPrecio}
            className="filter-panel__price-input"
          />
          <input
            type="number"
            name="maxPrecio"
            placeholder="Máximo"
            value={filters.maxPrecio}
            onChange={manejoCambioPrecio}
            className="filter-panel__price-input"
          />
        </div>
      </div>
    </div>
  );
}
