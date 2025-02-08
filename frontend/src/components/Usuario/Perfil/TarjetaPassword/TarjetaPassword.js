import React, { useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import { VerifyCurrentPasswordModal } from "../VerifyCurrentPasswordModal/VerifyCurrentPasswordModal";
import "./TarjetaPassword.scss";

export function TarjetaPassword({ usuario }) {
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
                    <Card.Header>{"Actualizar contraseña"}</Card.Header>
                    <Card.Meta></Card.Meta>
                    <Card.Description></Card.Description>
                </Card.Content>
            </Card>
            <VerifyCurrentPasswordModal 
                open={open} 
                onClose={handleClose} 
                usuario={usuario} 
                
            />
        </>
    );
}