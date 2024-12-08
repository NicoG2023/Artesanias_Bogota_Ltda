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
    children: [{ path: "", element: <AdminDashboard /> }],
  },
  {
    path: "/Usuarios",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [{ path: "", element: <Usuarios /> }],
  },
  {
    path: "/Ordenes",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [{ path: "", element: <Ordenes /> }],
  },
  {
    path: "/Inventario",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [{ path: "", element: <Inventario /> }],
  },
  {
    path: "/Analiticas",
    layout: AdminLayout,
    element: <PrivateRoutes allowedRoles={"admin"} />,
    children: [{ path: "", element: <Analiticas /> }],
  },
];

export default adminRoutes;
