import React from "react";
import PrivateRoutes from "./PrivateRoutes";
import { StaffLayout } from "../layouts";
import { Pagos, Ordenes, Informes } from "../pages";

const staffRoutes = [
  {
    path: "/Pagos",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff"} />,
    children: [
      {
        path: "",
        element: (
          <StaffLayout>
            <Pagos />
          </StaffLayout>
        ),
      },
    ],
  },
  {
    path: "/Ordenes",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff"} />,
    children: [
      {
        path: "",
        element: (
          <StaffLayout>
            <Ordenes />
          </StaffLayout>
        ),
      },
    ],
  },
  {
    path: "/Informes",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff"} />,
    children: [
      {
        path: "",
        element: (
          <StaffLayout>
            <Informes />
          </StaffLayout>
        ),
      },
    ],
  },
];

export default staffRoutes;
