import React from "react";
import PrivateRoutes from "./PrivateRoutes";
import { SuperAdminLayout } from "../layouts";
import { UsuariosSuperAdmin } from "../pages";

const superAdminRoutes = [
  {
    path: "/UsuariosSuperAdmin",
    layout: SuperAdminLayout,
    element: <PrivateRoutes allowedRoles={"superadmin"} />,
    children: [
      {
        path: "",
        element: (
          <SuperAdminLayout>
            <UsuariosSuperAdmin />
          </SuperAdminLayout>
        ),
      },
    ],
  },
];

export default superAdminRoutes;
