import React, { useState, useEffect } from "react";
import { UsuarioCreateForm } from '../../../components/Admin/UsuarioCreateForm/UsuarioCreateForm';
import { UsuariosTable } from '../../../components/Admin/UsuariosTable/UsuariosTable';
import { UsuarioModal } from '../../../components/Admin/UsuarioModal/UsuarioModal';
import { useAuth } from "../../../hooks";
import { toast } from "react-toastify";
import { getUsuariosPagesApi, getAllUsuariosApi } from "../../../api/usuario";
import "./Usuarios.scss"

export function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useAuth();


  const [usuarios, setUsuarios] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // Resultado de búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      await fetchUsuarios(currentPage);
      return;
    }
  
    try {
      const allUsuarios = await getAllUsuariosApi(auth.token);
      const filteredUsuarios = allUsuarios.filter((usuario) => {
        const lowercasedQuery = query.toLowerCase();
        return (
          usuario.nombre.toLowerCase().includes(lowercasedQuery) ||
          usuario.apellido.toLowerCase().includes(lowercasedQuery) ||
          usuario.id.toString().includes(lowercasedQuery)
        );
      });
      setSearchResults(filteredUsuarios);
    } catch (error) {
      toast.error(`Error al obtener usuarios: ${error.message}`);
    }
  };
  
  const fetchUsuarios = async (page = 1) => {
    try {
      const usuariosData = await getUsuariosPagesApi(auth.token, page);
      setUsuarios(usuariosData.usuarios);
      setTotalPages(usuariosData.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast.error(`Error al obtener usuarios: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsuarios(currentPage);
  }, [auth.token, currentPage]);


  return (
    <div className="usuarios">
      <h1 className="usuarios__title">Gestionar Usuarios</h1>
      <div className="usuarios__container">
        <button className="button__modal" onClick={() => setIsModalOpen(true)}>
          Registrar un nuevo usuario
        </button>


        <UsuarioModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          UsuarioForms={UsuarioCreateForm}
          onUserAction={fetchUsuarios}
        />

        <div className="usuario__table_container">
          <UsuariosTable
            usuariosData={searchResults || usuarios}
            onUserActionTable={fetchUsuarios}
            currentUserRole={"admin"}
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












