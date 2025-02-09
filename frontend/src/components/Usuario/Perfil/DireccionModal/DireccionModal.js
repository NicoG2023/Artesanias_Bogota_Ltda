import React, { useState } from "react";
import { Modal, Icon, Button, Table } from "semantic-ui-react";
import { DireccionCreateModalForm } from "../DireccionCreateModalForm/DireccionCreateModalForm";
import "./DireccionModal.scss";

export function DireccionModal({
    open,
    onClose,
    direcciones = [],
    onEditarDireccion,
    onEliminarDireccion,
    onUpdateDirecciones
}) {
    const [openCreateModal, setOpenCreateModal] = useState(false);

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

    return (
        <>
            <Modal open={open} onClose={onClose} size="large" className="modal-form-usuario">
                <button className="close-button" onClick={onClose}>
                    <Icon name="close" />
                </button>
                <Modal.Header className="header-title">
                    Administrar Direcciones
                </Modal.Header>
                <Modal.Content scrolling>
                    <div className="contenedor-modal">
                        <Button primary onClick={handleAgregarDireccion}>
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
                                                    <Button onClick={() => onEditarDireccion(direccion)}>Editar</Button>
                                                    <Button color="red" onClick={() => onEliminarDireccion(direccion.id)}>Eliminar</Button>
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
        </>
    );
}




