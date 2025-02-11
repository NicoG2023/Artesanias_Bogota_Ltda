import React, { useState } from "react";
import { Table, Button, Input, Pagination } from "semantic-ui-react";
import { PuntosVentaModal } from "../PuntosVentaModal/PuntosVentaModal";
import { PuntosVentaUpdateForm } from "../PuntosVentaUpdateForm/PuntosVentaUpdateForm";
import { PuntosVentaDeleteModal } from "../PuntosVentaDeleteModal/PuntosVentaDeleteModal";
import "./PuntosVentaTable.scss";

export function PuntosVentaTable({
  puntosVentaData,
  onUserActionTable,
  currentPage,
  totalPages,
  setCurrentPage,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPuntoVenta, setSelectedPuntoVenta] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Función para ordenar los puntos de venta por ID ascendente
  const sortDataAsc = (data) => {
    return data.sort((a, b) => a.id - b.id);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleEditClick = (puntoVenta) => {
    setSelectedPuntoVenta({...puntoVenta});
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (puntoVenta) => {
    setSelectedPuntoVenta({...puntoVenta});
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedPuntoVenta(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedPuntoVenta(null);
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
    // Limpiar búsqueda al cambiar de página
    if (searchQuery) {
      setSearchQuery("");
      onSearch("");
    }
  };

  const handleUserAction = async () => {
    // Verifica si hay una búsqueda activa
    if (searchQuery) {
      await onSearch(searchQuery); // Filtra resultados con la búsqueda activa
    } else {
      await onUserActionTable(currentPage); // Obtiene datos para la página actual
    }
  };

  // Datos ordenados
  const sortedData = sortDataAsc(puntosVentaData);

  return (
    <div className="table-container">
    <div className="fixed-header">
      <Input
        icon="search"
        placeholder="Buscar por nombre o ID..."
        value={searchQuery}
        onChange={handleSearchChange}
        fluid
      />
    </div>

    <div className="table-scroll-container">
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Tipo</Table.HeaderCell>
            <Table.HeaderCell>Direccion</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedData.map((puntoVenta) => (
            <Table.Row key={puntoVenta.id}>
              <Table.Cell>{puntoVenta.id}</Table.Cell>
              <Table.Cell>{puntoVenta.nombre}</Table.Cell>
              <Table.Cell>{puntoVenta.tipo}</Table.Cell>
              <Table.Cell>{puntoVenta.tipo === "fisico" ? puntoVenta.direccion || "N/A" : "No aplica"}</Table.Cell>
              <Table.Cell>
                <Button className="btn-actualizar" onClick={() => handleEditClick(puntoVenta)}>
                  Actualizar
                </Button>
                <Button className="btn-eliminar" onClick={() => handleDeleteClick(puntoVenta)}>
                  Eliminar
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>

    <div className="fixed-footer">
      {!searchQuery && (
        <Pagination
          activePage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          boundaryRange={1}
          siblingRange={1}
          ellipsisItem={{ content: "..." }}
          firstItem={{ content: "Primera", icon: "angle double left" }}
          lastItem={{ content: "Última", icon: "angle double right" }}
          nextItem={{ content: "Siguiente", icon: "angle right" }}
          prevItem={{ content: "Anterior", icon: "angle left" }}
        />
      )}
    </div>

      {selectedPuntoVenta && (
        <PuntosVentaModal
          open={isUpdateModalOpen}
          onClose={handleModalClose}
          PuntosVentaForms={() => (
            <PuntosVentaUpdateForm
              key={`update-${selectedPuntoVenta.id}`}
              puntoVenta={selectedPuntoVenta}
              onClose={handleModalClose}
              onUserActions={handleUserAction}
            />
          )}
          selectedPuntoVenta={selectedPuntoVenta}
          onUserAction={handleUserAction}
        />
      )}

      {selectedPuntoVenta && (
        <PuntosVentaDeleteModal
          open={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          selectedPuntoVenta={selectedPuntoVenta}
          onUserActions={handleUserAction}
        />
      )}
    </div>
  );
}
