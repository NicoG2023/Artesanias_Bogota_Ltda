import React from "react";
import PrivateRoutes from "./PrivateRoutes";
import { StaffLayout } from "../layouts";
import { Pagos, Ordenes, Informes } from "../pages";

const staffRoutes = [
  {
    path: "/Pagos",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff"} />,
    children: [{ path: "", element: <Pagos /> }],
  },
  {
    path: "/Ordenes",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff"} />,
    children: [{ path: "", element: <Ordenes /> }],
  },
  {
    path: "/Informes",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff"} />,
    children: [{ path: "", element: <Informes /> }],
  },
];

export default staffRoutes;
