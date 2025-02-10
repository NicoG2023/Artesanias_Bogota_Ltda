import React, { useState } from "react";
import { Modal, Icon, Button, Table } from "semantic-ui-react";
import { DireccionCreateModalForm } from "../DireccionCreateModalForm/DireccionCreateModalForm";
import { DireccionUpdateModalForm } from "../DireccionUpdateModalForm/DireccionUpdateModalForm";
import { DireccionDeleteModal } from "../DireccionDeleteModal/DireccionDeleteModal";
import "./DireccionModal.scss";

export function DireccionModal({
    open,
    onClose,
    direcciones = [],
    onUpdateDirecciones
}) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [direccionToEdit, setDireccionToEdit] = useState(null);
    const [direccionToDelete, setDireccionToDelete] = useState(null);

    const handleAgregarDireccion = () => {
        setOpenCreateModal(true);
        onClose();
    };

    const handleDireccionCreada = () => {
        setOpenCreateModal(false);
        if (onUpdateDirecciones) {
            onUpdateDirecciones();
        }
    };

    const handleEditarDireccion = (direccion) => {
        setDireccionToEdit(direccion);
        setOpenUpdateModal(true);
        onClose();
    };

    const handleEliminarDireccion = (direccion) => {
        setDireccionToDelete(direccion);
        setOpenDeleteModal(true);
        onClose();
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
        setDireccionToEdit(null);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setDireccionToDelete(null);
    };

    const handleDireccionActualizada = () => {
        handleCloseUpdateModal();
        if (onUpdateDirecciones) {
            onUpdateDirecciones();
        }
        setDireccionToEdit(null);
    };

    const handleDireccionEliminada = () => {
        handleCloseDeleteModal();
        if (onUpdateDirecciones) {
            onUpdateDirecciones();
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose} size="large" className="modal-form-direccion" closeIcon>
                <Modal.Header>
                    Direcciones
                </Modal.Header>
                <Modal.Content scrolling>
                    <div className="contenedor-modal">
                        <Button className="btn-agregar" onClick={handleAgregarDireccion}>
                            Agregar Dirección
                        </Button>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Dirección</Table.HeaderCell>
                                    <Table.HeaderCell>Ciudad</Table.HeaderCell>
                                    <Table.HeaderCell>Departamento</Table.HeaderCell>
                                    <Table.HeaderCell className="codigo-postal">Código Postal</Table.HeaderCell>
                                    <Table.HeaderCell className="pais">País</Table.HeaderCell>
                                    <Table.HeaderCell className="info-adicional">Información Adicional</Table.HeaderCell>
                                    <Table.HeaderCell className="acciones">Acciones</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
        {direcciones && direcciones.length > 0 ? (
            [...direcciones]
                .sort((a, b) => b.id - a.id)
                .map((direccion) => (
                    <Table.Row key={direccion.id}>
                        <Table.Cell>{direccion.direccion}</Table.Cell>
                        <Table.Cell>{direccion.ciudad}</Table.Cell>
                        <Table.Cell>{direccion.departamento}</Table.Cell>
                        <Table.Cell>{direccion.codigo_postal || "N/A"}</Table.Cell>
                        <Table.Cell>{direccion.pais}</Table.Cell>
                        <Table.Cell className="info-adicional">{direccion.info_adicional || "N/A"}</Table.Cell>
                        <Table.Cell className="acciones">
                            <Button className="btn-actualizar" onClick={() => handleEditarDireccion(direccion)}>Actualizar</Button>
                            <Button color="red" className="btn-eliminar" onClick={() => handleEliminarDireccion(direccion)}>Eliminar</Button>
                        </Table.Cell>
                    </Table.Row>
                ))
        ) : (
            <Table.Row>
                <Table.Cell colSpan="7" textAlign="center">
                    No hay direcciones registradas.
                </Table.Cell>
            </Table.Row>
        )}
    </Table.Body>
</Table>
                    </div>
                </Modal.Content>
            </Modal>

            <DireccionCreateModalForm
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onDireccionCreada={handleDireccionCreada}
            />

            {direccionToEdit && (
                <DireccionUpdateModalForm
                    open={openUpdateModal}
                    onClose={handleCloseUpdateModal}
                    direccion={direccionToEdit}
                    onUserActions={handleDireccionActualizada}
                />
            )}

            {direccionToDelete && (
                <DireccionDeleteModal
                    open={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                    selectedDireccion={direccionToDelete}
                    onUserActions={handleDireccionEliminada}
                />
            )}
        </>
    );
}




