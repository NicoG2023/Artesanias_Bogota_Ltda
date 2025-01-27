import React from "react";
import {
  AdminDashboard,
  Usuarios,
  OrdenesAdmin,
  Inventario,
  Analiticas,
  AgregarInfo,
} from "../pages";
import { AdminLayout } from "../layouts";
import PrivateRoutes from "./PrivateRoutes";

const adminRoutes = [
  {
    path: "/admin",
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
    path: "/admin-usuarios",
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
    path: "/admin-ordenes",
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [
      {
        path: "",
        element: (
          <AdminLayout>
            <OrdenesAdmin />
          </AdminLayout>
        ),
      },
    ],
  },
  {
    path: "/admin-inventario",
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
    path: "/admin-analiticas",
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
  {
    path: "/admin-agregar-info",
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [
      {
        path: "",
        element: (
          <AdminLayout>
            <AgregarInfo />
          </AdminLayout>
        ),
      },
    ],
  },
];

export default adminRoutes;
