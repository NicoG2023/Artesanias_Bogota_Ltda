import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";

function PrivateRoutes({ allowedRoles }) {
  const { auth } = useAuth();

  const hasAccess = auth?.user && allowedRoles.includes(auth.user.rol);

  if (!auth?.user) {
    //Usuario no autenticado: redirige al inicio de sesion
    return <Navigate to="/Login" />;
  }

  if (!hasAccess) {
    //Usuario autenticado pero sin acceso: redirige a una pagina de acceso denegado
    return <Navigate to="/access-denied" />;
  }

  //Usuario autenticado y con acceso: muestra el contenido
  return <Outlet />;
}

export default PrivateRoutes;
