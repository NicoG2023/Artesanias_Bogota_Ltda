import React from "react";
import { ClientesDashboard, Carrito, OrdenesCliente } from "../pages";
import { ClientLayout } from "../layouts";
import PrivateRoutes from "./PrivateRoutes";

const clientesRoutes = [
  {
    path: "/Productos",
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
];

export default clientesRoutes;
