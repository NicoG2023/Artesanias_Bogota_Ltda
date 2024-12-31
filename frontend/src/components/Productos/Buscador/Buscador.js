// src/components/Buscador/Buscador.jsx
import React, { useState } from "react";
import { Input, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

export function Buscador({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Cada vez que el usuario teclee algo, actualizamos el estado local
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Al dar clic al ícono o presionar Enter, se dispara la búsqueda
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // Permitir búsqueda al presionar Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Input
      className="buscador-input" // <-- Clase para personalizar el estilo
      icon={
        <Icon name="search" inverted circular link onClick={handleSearch} />
      }
      placeholder="Buscar productos..."
      value={searchTerm}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
}
