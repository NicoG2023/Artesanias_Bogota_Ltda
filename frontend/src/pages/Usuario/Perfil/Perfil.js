import React, { useEffect, useState } from "react";
import { getMeApi } from "../../../api/usuario";
import { useAuth } from "../../../hooks";
import { TarjetaPerfilDatos } from "../../../components/Usuario/Perfil/TarjetaPerfilDatos/TarjetaPerfilDatos";
import { TarjetaUpdateDatos } from "../../../components/Usuario/Perfil/TarjetaUpdateDatos/TarjetaUpdateDatos";
import { UpdateNombreApellidoForm } from "../../../components/Usuario/Perfil/UpdateNombreApellidoForm/UpdateNombreApellidoForm";
import { UpdateEmailForm } from "../../../components/Usuario/Perfil/UpdateEmailForm/UpdateEmailForm";
import { TarjetaPassword } from "../../../components/Usuario/Perfil/TarjetaPassword/TarjetaPassword";
import "./Perfil.scss";

export function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const { auth } = useAuth();

  const recargarDatosUsuario = async () => {
      try {
          const data = await getMeApi(auth.token);
          setUsuario(data);
      } catch (error) {
          console.error("Error al obtener los datos del usuario", error);
      }
  };

  useEffect(() => {
      if (auth.token) {
          recargarDatosUsuario();
      }
  }, [auth.token]);

  if (!usuario) return <p>Cargando datos del usuario...</p>;

  return (
      <div className="perfil-container">
          <div className="titulo">Tu perfil</div>
          <div className="tarjeta-datos">
              <TarjetaPerfilDatos usuario={usuario} />
          </div>
          <div className="tarjeta-actualizar-nombreApellido">
              <TarjetaUpdateDatos 
                  usuario={usuario}
                  titulo="Actualizar información personal"
                  Formulario={UpdateNombreApellidoForm}
                  onUpdate={recargarDatosUsuario}
              />
          </div>
          <div className="tarjeta-actualizar-email">
              <TarjetaUpdateDatos 
                  usuario={usuario}
                  titulo="Actualizar correo electrónico"
                  Formulario={UpdateEmailForm}
                  onUpdate={recargarDatosUsuario}
              />
          </div>
          <div className="tarjeta-actualizar-contraseña">
              <TarjetaPassword
                  usuario={usuario}
                  onUpdate={recargarDatosUsuario}
              />
          </div>
      </div>
  );
}


