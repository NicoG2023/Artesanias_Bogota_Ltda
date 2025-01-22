import React, { useState, useEffect } from "react";
import { PuntosVentaCreateForm } from "../../../components/Admin/GestionPuntosVenta/PuntosVentaCreateForm/PuntosVentaCreateForm";
import { PuntosVentaTable } from "../../../components/Admin/GestionPuntosVenta/PuntosVentaTable/PuntosVentaTable";
import { PuntosVentaModal } from "../../../components/Admin/GestionPuntosVenta/PuntosVentaModal/PuntosVentaModal";
import { useAuth } from "../../../hooks";
import { toast } from "react-toastify";
import { obtenerPuntosDeVentaApi, obtenerPuntosDeVentaPagesApi } from "../../../api/puntosVenta";
import "./PuntosVenta.scss"

export function PuntosVenta() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useAuth();
  const [puntosVenta, setPuntosVenta] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      await fetchPuntosVenta(currentPage);
      return;
    }
  
    try {
      const allPuntosVenta = await obtenerPuntosDeVentaApi(auth.token);
      const filteredPuntosVenta = allPuntosVenta.filter((puntoVenta) => {
        const lowercasedQuery = query.toLowerCase();
        return (
          puntoVenta.nombre.toLowerCase().includes(lowercasedQuery) ||
          puntoVenta.id.toString().includes(lowercasedQuery)
        );
      });
      setSearchResults(filteredPuntosVenta);
    } catch (error) {
      toast.error(`Error al obtener puntos de venta: ${error.message}`);
    }
  };
  
  const fetchPuntosVenta = async (page = 1) => {
    try {
      const puntosVentaData = await obtenerPuntosDeVentaPagesApi(auth.token, page);
      setPuntosVenta(puntosVentaData.puntosVenta);
      setTotalPages(puntosVentaData.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast.error(`Error al obtener puntos de venta: ${error.message}`);
    }
  };

  // Función para manejar la creación de un punto de venta
  const handleCreatePuntoVenta = async () => {
    try {
      // Obtener el número total de páginas actualizado
      const puntosVentaData = await obtenerPuntosDeVentaPagesApi(auth.token, 1);
      const newTotalPages = puntosVentaData.totalPages;
      
      // Actualizar el estado y cargar la última página
      setTotalPages(newTotalPages);
      await fetchPuntosVenta(newTotalPages);
      
      // Cerrar el modal
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Error al actualizar la vista: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPuntosVenta(currentPage);
  }, [auth.token, currentPage]);

  return (
    <div className="puntosVenta">
      <h1 className="puntosVenta__title">Gestionar puntos de venta</h1>
      <div className="puntosVenta__container">
        <button className="button__modal" onClick={() => setIsModalOpen(true)}>
          Registrar un nuevo punto de venta
        </button>

        <PuntosVentaModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          PuntosVentaForms={(props) => (
            <PuntosVentaCreateForm
              {...props}
              onUserActions={handleCreatePuntoVenta}
            />
          )}
          onUserAction={handleCreatePuntoVenta}
        />

        <div className="puntosVenta__table_container">
          <PuntosVentaTable
            puntosVentaData={searchResults || puntosVenta}
            onUserActionTable={fetchPuntosVenta}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onSearch={handleSearch}
          />
        </div>
      </div>
    </div>
  );
}