import React, { useState, useEffect } from "react";
import { Card, Icon } from "semantic-ui-react";
import { DireccionModal } from "../DireccionModal/DireccionModal";
import "./TarjetaDireccion.scss";

export function TarjetaDireccion({ usuario, onUpdate, direcciones }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Card fluid onClick={handleOpen} className="clickable-card">
                <Card.Content textAlign="center">
                    <Icon name="building" size="huge" />
                    <Card.Header>{"Direcciones"}</Card.Header>
                    <Card.Meta>
                        {direcciones?.length || 0} direcciones registradas
                    </Card.Meta>
                    <Card.Description></Card.Description>
                </Card.Content>
            </Card>
            <DireccionModal
                open={open}
                onClose={handleClose}
                direcciones={direcciones || []}
                onUpdateDirecciones={onUpdate}
            />
        </>
    );
}