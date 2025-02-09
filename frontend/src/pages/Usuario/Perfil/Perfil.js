import React, { useEffect, useState } from "react";
import { getMeApi } from "../../../api/usuario";
import { getAllDireccionesApi } from "../../../api/direcciones";
import { useAuth } from "../../../hooks";
import { TarjetaPerfilDatos } from "../../../components/Usuario/Perfil/TarjetaPerfilDatos/TarjetaPerfilDatos";
import { TarjetaUpdateDatos } from "../../../components/Usuario/Perfil/TarjetaUpdateDatos/TarjetaUpdateDatos";
import { UpdateNombreApellidoForm } from "../../../components/Usuario/Perfil/UpdateNombreApellidoForm/UpdateNombreApellidoForm";
import { UpdateEmailForm } from "../../../components/Usuario/Perfil/UpdateEmailForm/UpdateEmailForm";
import { TarjetaPassword } from "../../../components/Usuario/Perfil/TarjetaPassword/TarjetaPassword";
import { TarjetaDireccion } from "../../../components/Usuario/Perfil/TarjetaDireccion/TarjetaDireccion";
import "./Perfil.scss";

export function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [direcciones, setDirecciones] = useState([]);
    const { auth } = useAuth();

    const obtenerDirecciones = async () => {
        try {
            const direccionesData = await getAllDireccionesApi(auth.token);
            setDirecciones(direccionesData);
            console.log("Direcciones actualizadas:", direccionesData);
        } catch (error) {
            console.error("Perfil - Error al obtener las direcciones:", error);
        }
    };

    const recargarDatosUsuario = async () => {
        try {
            const data = await getMeApi(auth.token);
            setUsuario(data);
            await obtenerDirecciones();
        } catch (error) {
            console.error("Error al obtener los datos", error);
        }
    };

    useEffect(() => {
        if (auth.token) {
            recargarDatosUsuario();
        }
    }, [auth.token]);

    if (!usuario) return <p>Cargando datos del usuario...</p>;

    return (
        <div className="perfil-page">
            <h1 className="perfil-titulo">TU PERFIL</h1>
            <div className="perfil-container">
                <div className="perfil-datos">
                    <TarjetaPerfilDatos usuario={usuario} />
                </div>
                <div className="perfil-opciones">
                    <TarjetaUpdateDatos
                        usuario={usuario}
                        titulo="Actualizar información personal"
                        Formulario={UpdateNombreApellidoForm}
                        onUpdate={recargarDatosUsuario}
                        icono={"pencil alternate"}
                    />
                    <TarjetaUpdateDatos
                        usuario={usuario}
                        titulo="Actualizar correo electrónico"
                        Formulario={UpdateEmailForm}
                        onUpdate={recargarDatosUsuario}
                        icono={"envelope"}
                    />
                    <TarjetaDireccion
                        usuario={usuario}
                        direcciones={direcciones}
                        onUpdate={obtenerDirecciones}
                    />
                    <TarjetaPassword usuario={usuario} />
                </div>
            </div>
        </div>
    );
}




