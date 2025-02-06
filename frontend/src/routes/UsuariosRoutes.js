import React from "react";
import { BasicLayout } from "../layouts";
import { Login, OlvidarPassword, Registro, LandingPage, Perfil } from "../pages";
import { DynamicLayout } from "../layouts/DynamicLayout";

const usuariosRoutes = [
  {
    path: "/",
    element: (
      <BasicLayout>
        <LandingPage />
      </BasicLayout>
    ),
  },
  {
    path: "/Login",
    element: (
      <BasicLayout>
        <Login />
      </BasicLayout>
    ),
  },
  {
    path: "/Registro",
    element: (
      <BasicLayout>
        <Registro />
      </BasicLayout>
    ),
  },
  {
    path: "/OlvidoContraseña",
    element: (
      <BasicLayout>
        <OlvidarPassword />
      </BasicLayout>
    ),
  },
  {
    path: "/productos",
    element: <DynamicLayout />,
  },
  {
    path: "/perfil",
    element: (
      <BasicLayout>
        <Perfil />
      </BasicLayout>
    ),
  },
];

export default usuariosRoutes;
