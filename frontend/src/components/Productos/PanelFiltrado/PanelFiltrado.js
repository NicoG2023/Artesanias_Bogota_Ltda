import React, { useState } from "react";
import { Input } from "semantic-ui-react";
import "./PanelFiltrado.scss";

export function PanelFiltrado({ productosHook }) {
  const { categorias, colores, updateFilters } = productosHook;

  // Almacenamos los filtros en un estado local, pero ya no dispararemos
  // updateFilters() inmediatamente en cada cambio
  const [localFilters, setLocalFilters] = useState({
    categoria: [],
    color: [],
    minPrecio: 0,
    maxPrecio: 100000000,
  });

  // Manejo de cambio de categorías (checkbox multiple)
  const manejoCambioCategoria = (categoriaId) => {
    let newCategorias;
    // Si ya está en el array, la quitamos; si no, la añadimos
    if (localFilters.categoria.includes(categoriaId)) {
      newCategorias = localFilters.categoria.filter((c) => c !== categoriaId);
    } else {
      newCategorias = [...localFilters.categoria, categoriaId];
    }

    // Actualizamos únicamente el estado local
    setLocalFilters((prev) => ({
      ...prev,
      categoria: newCategorias,
    }));
  };

  // Manejo de cambio de colores (checkbox multiple)
  const manejoCambioColor = (colorName) => {
    let newColores;
    if (localFilters.color.includes(colorName)) {
      newColores = localFilters.color.filter((c) => c !== colorName);
    } else {
      newColores = [...localFilters.color, colorName];
    }

    // Actualizamos únicamente el estado local
    setLocalFilters((prev) => ({
      ...prev,
      color: newColores,
    }));
  };

  // Manejo de cambio de rango de precios
  const manejoCambioPrecio = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cuando se hace clic en el botón "Filtrar",
  // disparamos el updateFilters con los valores actuales de localFilters.
  const manejarFiltrar = () => {
    updateFilters(localFilters);
  };

  return (
    <div className="filter-panel">
      <h2 className="filter-panel__title">Filtros</h2>

      {/* Filtro por Categoría */}
      <div className="filter-panel__section filter-panel__section--scrollable">
        <h3 className="filter-panel__subtitle">Categoría</h3>
        {categorias.map((categoria) => (
          <div key={categoria.id} className="filter-panel__checkbox">
            <Input
              type="checkbox"
              id={`categoria-${categoria.id}`}
              name="categoria"
              className="filter-panel__checkbox-input"
              checked={localFilters.categoria.includes(categoria.id)}
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
            <Input
              type="checkbox"
              id={color}
              className="filter-panel__checkbox-input"
              checked={localFilters.color.includes(color)}
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
          <Input
            type="number"
            name="minPrecio"
            placeholder="Mínimo"
            onChange={manejoCambioPrecio}
            className="filter-panel__price-input"
            value={localFilters.minPrecio}
          />
          <Input
            type="number"
            name="maxPrecio"
            placeholder="Máximo"
            onChange={manejoCambioPrecio}
            className="filter-panel__price-input"
            value={localFilters.maxPrecio}
          />
        </div>
      </div>

      {/* Botón para aplicar filtros */}
      <button className="filter-panel__apply-button" onClick={manejarFiltrar}>
        Filtrar
      </button>
    </div>
  );
}
