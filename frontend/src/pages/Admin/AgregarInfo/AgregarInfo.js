// src/pages/Admin/AgregarInfo.js
import React from "react";
import {
  agregarCategoriasApi,
  descargarPlantillaCategoriasApi,
} from "../../../api/categorias";
import {
  agregarProductosBulkApi,
  descargarPlantillaProductoApi,
} from "../../../api/productos";
import { SubirArchivo } from "../../../components/Admin";

export function AgregarInfo() {
  // Función para subir categorías
  const onSubmitCategorias = async (token, jsonData) => {
    // Suponemos que el JSON trae { categorias: [ ... ] }
    return await agregarCategoriasApi(token, jsonData.categorias);
  };

  // Función para subir productos
  const onSubmitProductos = async (token, jsonData) => {
    // Suponemos que el JSON trae { productos: [ ... ] }
    return await agregarProductosBulkApi(token, jsonData.productos);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Agregar Productos</h2>
      <SubirArchivo
        title="Agregar Productos"
        onSubmit={onSubmitProductos} // Llamamos a la función que maneja la estructura
        onDownloadTemplate={descargarPlantillaProductoApi}
      />

      <h2>Agregar Categorías</h2>
      <SubirArchivo
        title="Agregar Categorías"
        onSubmit={onSubmitCategorias} // Llamamos a la función para categorias
        onDownloadTemplate={descargarPlantillaCategoriasApi}
      />
    </div>
  );
}
