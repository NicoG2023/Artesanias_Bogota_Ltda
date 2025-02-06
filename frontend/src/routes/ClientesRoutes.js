import React from "react";
import {
  ClientesDashboard,
  Carrito,
  OrdenesCliente,
  ResumenOrden,
} from "../pages";
import { ClientLayout } from "../layouts";
import PrivateRoutes from "./PrivateRoutes";

const clientesRoutes = [
  {
    path: "/clientes-dashboard",
    element: (
      <ClientLayout>
        <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
      </ClientLayout>
    ),
    children: [
      {
        path: "",
        element: <ClientesDashboard />,
      },
    ],
  },
  {
    path: "/Carrito",
    element: (
      <ClientLayout>
        <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
      </ClientLayout>
    ),
    children: [
      {
        path: "",
        element: <Carrito />,
      },
    ],
  },
  {
    path: "/Pagos",
    element: (
      <ClientLayout>
        <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
      </ClientLayout>
    ),
    children: [{ path: "", element: <Carrito /> }],
  },
  {
    path: "/ordenes-cliente",
    element: (
      <ClientLayout>
        <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
      </ClientLayout>
    ),
    children: [
      {
        path: "",
        element: <OrdenesCliente />,
      },
    ],
  },
  {
    path: "/resumen-orden",
    element: (
      <ClientLayout>
        <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
      </ClientLayout>
    ),
    children: [
      {
        path: "",
        element: <ResumenOrden />,
      },
    ],
  },
];

export default clientesRoutes;
