// PanelFiltrado.jsx
import React, { useState } from "react";
import "./PanelFiltrado.scss";

export function PanelFiltrado({ productosHook }) {
  const { categorias, colores, updateFilters } = productosHook;

  // Ahora almacenamos arrays para permitir múltiples selecciones
  const [filters, setFilters] = useState({
    categoria: [], // Array de IDs de categorías seleccionadas
    color: [], // Array de colores seleccionados
    minPrecio: 0,
    maxPrecio: 100000000,
  });

  // Manejo de cambio de categorías (checkbox multiple)
  const manejoCambioCategoria = (categoriaId) => {
    let newCategorias;
    // Si ya está en el array, la quitamos; si no, la añadimos
    if (filters.categoria.includes(categoriaId)) {
      newCategorias = filters.categoria.filter((c) => c !== categoriaId);
    } else {
      newCategorias = [...filters.categoria, categoriaId];
    }

    // Actualizamos estado local
    const newFilters = { ...filters, categoria: newCategorias };
    setFilters(newFilters);

    // Llamamos a updateFilters para disparar la nueva búsqueda
    updateFilters(newFilters);
  };

  // Manejo de cambio de colores (checkbox multiple)
  const manejoCambioColor = (colorName) => {
    let newColores;
    if (filters.color.includes(colorName)) {
      newColores = filters.color.filter((c) => c !== colorName);
    } else {
      newColores = [...filters.color, colorName];
    }

    const newFilters = { ...filters, color: newColores };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  // Manejo de cambio de rango de precios
  const manejoCambioPrecio = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  return (
    <div className="filter-panel">
      <h2 className="filter-panel__title">Filtros</h2>

      {/* Filtro por Categoría */}
      <div className="filter-panel__section filter-panel__section--scrollable">
        <h3 className="filter-panel__subtitle">Categoría</h3>
        {categorias.map((categoria) => (
          <div key={categoria.id} className="filter-panel__checkbox">
            <input
              type="checkbox"
              id={`categoria-${categoria.id}`}
              name="categoria"
              className="filter-panel__checkbox-input"
              checked={filters.categoria.includes(categoria.id)}
              onChange={() => manejoCambioCategoria(categoria.id)}
            />
            <label
              htmlFor={`categoria-${categoria.id}`}
              className="filter-panel__checkbox-label"
            >
              {categoria.nombre}
            </label>
          </div>
        ))}
      </div>

      {/* Filtro por Color */}
      <div className="filter-panel__section filter-panel__section--scrollable">
        <h3 className="filter-panel__subtitle">Color</h3>
        {colores.map((color) => (
          <div key={color} className="filter-panel__checkbox">
            <input
              type="checkbox"
              id={color}
              className="filter-panel__checkbox-input"
              checked={filters.color.includes(color)}
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
            value={filters.minPrecio}
          />
          <input
            type="number"
            name="maxPrecio"
            placeholder="Máximo"
            onChange={manejoCambioPrecio}
            className="filter-panel__price-input"
            value={filters.maxPrecio}
          />
        </div>
      </div>
    </div>
  );
}
