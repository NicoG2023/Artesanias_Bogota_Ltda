import React from "react";
import PrivateRoutes from "./PrivateRoutes";
import { SuperAdminLayout } from "../layouts";

const superAdminRoutes = [
  {
    path: "/UsuariosSuperAdmin",
    layout: SuperAdminLayout,
    element: <PrivateRoutes allowedRoles={"superadmin"} />,
    children: [{ path: "", element: <UsuariosSuperAdmin /> }],
  },
];

export default superAdminRoutes;
