import React from "react";
import {
  ClientesDashboard,
  Carrito,
  OrdenesCliente,
  ResumenOrden,
  DetalleOrdenEnvio,
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
      <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
    ),
    children: [
      {
        path: "",
        element: (
          <ClientLayout>
            <ResumenOrden />
          </ClientLayout>
        ),
      },
    ],
  },
  {
    path: "/detalle-orden",
    element: (
      <PrivateRoutes allowedRoles={"admin, cliente, staff, superadmin"} />
    ),
    children: [
      {
        path: "",
        element: (
          <ClientLayout>
            <DetalleOrdenEnvio />
          </ClientLayout>
        ),
      },
    ],
  },
];

export default clientesRoutes;
