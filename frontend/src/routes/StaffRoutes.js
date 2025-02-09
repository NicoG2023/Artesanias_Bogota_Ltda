import React from "react";
import PrivateRoutes from "./PrivateRoutes";
import { StaffLayout } from "../layouts";
import {
  Pagos,
  Ordenes,
  Informes,
  ProductosStaff,
  StaffDashboard,
} from "../pages";

const staffRoutes = [
  {
    path: "/staff-dashboard",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff"} />,
    children: [
      {
        path: "",
        element: (
          <StaffLayout>
            <StaffDashboard />
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
  {
    path: "/productos-staff",
    layout: StaffLayout,
    element: <PrivateRoutes allowedRoles={"staff, admin, superadmin"} />,
    children: [
      {
        path: "",
        element: (
          <StaffLayout>
            <ProductosStaff />
          </StaffLayout>
        ),
      },
    ],
  },
];

export default staffRoutes;
