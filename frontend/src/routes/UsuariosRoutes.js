import React from 'react';
import { Routes, Route } from 'react-router-dom';

const usuariosRoutes = [
  //const { userRole } = useAuth();
  {path: "/Home",
    element: <HomeDashboard />, 
  },
  {path: "/Login",
    element:  <Login />,
  },
  {path: "/Registro",
    element: <Registro />,
  },
  {path: "/OlvidoContraseña",
    element: <Contraseña />,
  },
  {path: "/Productos",
    element: <Productos />,
  },
  {/* Agrega más rutas específicas para usuarios */}
]

export default usuariosRoutes;