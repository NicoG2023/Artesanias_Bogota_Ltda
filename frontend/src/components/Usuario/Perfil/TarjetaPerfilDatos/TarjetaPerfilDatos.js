import React from "react";
import { Card } from "semantic-ui-react";
import "./TarjetaPerfilDatos.scss";

export function TarjetaPerfilDatos({ usuario }) {
    return (
        <Card fluid>
            <Card.Content textAlign="center">
                <Card.Header>{`${usuario.nombre} ${usuario.apellido}`}</Card.Header>
                <Card.Meta>
                    <div className="id">ID {usuario.id}</div>
                    <div className="email">{usuario.email}</div>
                </Card.Meta>
                <Card.Description>
                    <p>Rol: {usuario.rol}</p>
                    <p>Puntos de descuento: {usuario.puntos_descuento}</p>
                </Card.Description>
            </Card.Content>
        </Card>
    );
}