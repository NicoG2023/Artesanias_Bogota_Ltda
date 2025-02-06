import React, { useEffect, useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import { getMeApi } from "../../../api/usuario";
import { useAuth } from "../../../hooks";
import "./Perfil.scss";


export function Perfil({ token }) {
    const [usuario, setUsuario] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
      async function fetchUser() {
        try {
          const data = await getMeApi(auth.token);
          setUsuario(data);
        } catch (error) {
          console.error("Error al obtener los datos del usuario", error);
        }
      }
  
      if (auth.token) {
        fetchUser();
      }
    }, [auth.token]);
  
    if (!usuario) return <p>Cargando datos del usuario...</p>;
  
    return (
      <div className="perfil-container">
        <Card fluid>
          <Card.Content textAlign="center">
            <Icon name="user circle" size="huge" />
            <Card.Header>{`${usuario.nombre} ${usuario.apellido}`}</Card.Header>
            <Card.Meta>
              <span className="email">{usuario.email}</span>
            </Card.Meta>
            <Card.Description>
              <p>Rol: {usuario.rol}</p>
              <p>Puntos de descuento: {usuario.puntos_descuento}</p>
              <p>{usuario.es_activo ? "Cuenta activa" : "Cuenta inactiva"}</p>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }

