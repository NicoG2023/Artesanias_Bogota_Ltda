import React from "react";
import {
  AdminDashboard,
  Usuarios,
  Ordenes,
  Inventario,
  Analiticas,
} from "../pages";
import { AdminLayout } from "../layouts";
import PrivateRoutes from "./PrivateRoutes";

const adminRoutes = [
  {
    path: "/admin",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [
      {
        path: "",
        element: (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        ),
      },
    ],
  },
  {
    path: "/Usuarios",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [
      {
        path: "",
        element: (
          <AdminLayout>
            <Usuarios />
          </AdminLayout>
        ),
      },
    ],
  },
  {
    path: "/Ordenes",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [
      {
        path: "",
        element: (
          <AdminLayout>
            <Ordenes />
          </AdminLayout>
        ),
      },
    ],
  },
  {
    path: "/Inventario",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [
      {
        path: "",
        element: (
          <AdminLayout>
            <Inventario />
          </AdminLayout>
        ),
      },
    ],
  },
  {
    path: "/Analiticas",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [
      {
        path: "",
        element: (
          <AdminLayout>
            <Analiticas />
          </AdminLayout>
        ),
      },
    ],
  },
];

export default adminRoutes;
