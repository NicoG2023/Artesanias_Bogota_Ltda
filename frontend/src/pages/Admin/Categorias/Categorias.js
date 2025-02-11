import React, { useEffect, useState } from "react";
import { Button, Icon } from "semantic-ui-react";
import { useCategoria } from "../../../hooks";
import { TablaCategorias, AgregarCategoria } from "../../../components";
import "./Categorias.scss";

export function Categorias() {
  const categoriaHook = useCategoria();
  const [openVincularModal, setOpenVincularModal] = useState(false);
  const [openAgregarModal, setOpenAgregarModal] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);

  // 🔹 Cargar categorías automáticamente al montar la página
  useEffect(() => {
    categoriaHook.obtenerCategorias();
  }, []);

  const handleOpenVincular = (categoriaId) => {
    setSelectedCategoriaId(categoriaId);
    categoriaHook.obtenerProductosNoRelacionados(categoriaId);
    setOpenVincularModal(true);
  };

  const handleCloseVincular = () => {
    setOpenVincularModal(false);
    setSelectedCategoriaId(null);
  };

  const handleOpenAgregar = () => {
    setOpenAgregarModal(true);
  };

  const handleCloseAgregar = () => {
    setOpenAgregarModal(false);
  };

  return (
    <div className="categorias-page">
      <h2>Categorías</h2>
      <div className="acciones-superiores">
        <Button primary onClick={handleOpenAgregar}>
          <Icon name="plus" /> Agregar Categoría
        </Button>
      </div>

      <TablaCategorias
        categoriaHook={categoriaHook}
        onVincular={handleOpenVincular}
      />

      <AgregarCategoria
        open={openAgregarModal}
        onClose={handleCloseAgregar}
        agregarCategoria={categoriaHook.agregarCategoria}
      />
    </div>
  );
}
