import React from "react";
import { BasicLayout } from "../layouts";
import { Login, OlvidarPassword, Registro } from "../pages";
import { DynamicLayout } from "../layouts/DynamicLayout";

const usuariosRoutes = [
  {
    path: "/Login",
    layout: BasicLayout,
    element: (
      <BasicLayout>
        <Login />
      </BasicLayout>
    ),
  },
  {
    path: "/Registro",
    layout: BasicLayout,
    element: (
      <BasicLayout>
        <Registro />
      </BasicLayout>
    ),
  },
  {
    path: "/OlvidoContraseña",
    layout: BasicLayout,
    element: (
      <BasicLayout>
        <OlvidarPassword />
      </BasicLayout>
    ),
  },
  {
    path: "/",
    element: <DynamicLayout />,
  },
];

export default usuariosRoutes;
