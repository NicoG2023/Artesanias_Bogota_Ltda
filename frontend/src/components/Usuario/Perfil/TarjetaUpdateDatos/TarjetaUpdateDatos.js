import React, { useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import { PerfilModal } from "../PerfilModal/PerfilModal";
import "./TarjetaUpdateDatos.scss";

export function TarjetaUpdateDatos({ usuario, titulo, onUpdate, Formulario }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Card fluid onClick={handleOpen} className="clickable-card">
                <Card.Content textAlign="center">
                    <Icon name="user circle" size="huge" />
                    <Card.Header>{titulo}</Card.Header>
                    <Card.Meta></Card.Meta>
                    <Card.Description></Card.Description>
                </Card.Content>
            </Card>
            <PerfilModal 
                open={open} 
                onClose={handleClose} 
                usuario={usuario} 
                Formulario={Formulario} 
                titulo={titulo} 
                onUserActions={onUpdate}
            />
        </>
    );
}