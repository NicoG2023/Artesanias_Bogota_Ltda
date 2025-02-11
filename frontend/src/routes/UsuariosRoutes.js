import React from "react";
import { BasicLayout } from "../layouts";
import {
  Login,
  OlvidarPassword,
  Registro,
  LandingPage,
  Verificacion,
  ConfirmarCodigoPage,
  ResetPassword,
} from "../pages";
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
    path: "/olvide-password",
    element: (
      <BasicLayout>
        <OlvidarPassword />
      </BasicLayout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <BasicLayout>
        <ResetPassword />
      </BasicLayout>
    ),
  },
  {
    path: "/verify",
    element: (
      <BasicLayout>
        <Verificacion />
      </BasicLayout>
    ),
  },
  {
    path: "/confirmar-codigo",
    element: (
      <BasicLayout>
        <ConfirmarCodigoPage />
      </BasicLayout>
    ),
  },
  {
    path: "/productos",
    element: <DynamicLayout />,
  },
];

export default usuariosRoutes;
