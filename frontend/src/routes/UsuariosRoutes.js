import React from "react";
import { BasicLayout } from "../layouts";
import { Login, OlvidarPassword, Productos, Registro } from "../pages";

const usuariosRoutes = [
  { path: "/Login", layout: BasicLayout, element: <Login /> },
  { path: "/Registro", layout: BasicLayout, element: <Registro /> },
  {
    path: "/OlvidoContraseña",
    layout: BasicLayout,
    element: <OlvidarPassword />,
  },
  { path: "/Productos", layout: BasicLayout, element: <Productos /> },
];

export default usuariosRoutes;
