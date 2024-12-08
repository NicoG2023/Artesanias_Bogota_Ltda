import React from "react";
import { ClientesDashboard, Carrito } from "../pages";
import { ClientLayout } from "../layouts";
import PrivateRoutes from "./PrivateRoutes";

const clientesRoutes = [
  {
    path: "/Productos",
    layout: ClientLayout,
    element: (
      <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
    ),
    children: [{ path: "", element: <ClientesDashboard /> }],
  },
  {
    path: "/Carrito",
    layout: ClientLayout,
    element: (
      <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
    ),
    children: [{ path: "", element: <Carrito /> }],
  },
  {
    path: "/Pagos",
    layout: ClientLayout,
    element: (
      <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
    ),
    children: [{ path: "", element: <Carrito /> }],
  },
  {
    path: "/Ordenes",
    layout: ClientLayout,
    element: (
      <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
    ),
    children: [{ path: "", element: <Carrito /> }],
  },
];

export default clientesRoutes;
