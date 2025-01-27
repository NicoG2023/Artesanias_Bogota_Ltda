import React from "react";
import { useAuth } from "../hooks";
import { Navigate } from "react-router-dom";
import {
  ClientLayout,
  AdminLayout,
  StaffLayout,
  SuperAdminLayout,
  BasicLayout,
} from "../layouts";
import { Productos } from "../pages";

export function DynamicLayout() {
  const { auth } = useAuth();

  // Si no está autenticado, renderiza el layout básico
  if (!auth?.user) {
    return (
      <BasicLayout>
        <Productos />
      </BasicLayout>
    );
  }

  // Si está autenticado, selecciona el layout según el rol
  switch (auth?.user?.rol) {
    case "cliente":
      return (
        <ClientLayout>
          <Productos />
        </ClientLayout>
      );
    case "admin":
      return (
        <AdminLayout>
          <Productos />
        </AdminLayout>
      );
    case "staff":
      return (
        <StaffLayout>
          <Productos />
        </StaffLayout>
      );
    case "superadmin":
      return (
        <SuperAdminLayout>
          <Productos />
        </SuperAdminLayout>
      );
    default:
      // Si el rol no es reconocido, redirige a una página de error o logout
      return <Navigate to="/access-denied" />;
  }
}
