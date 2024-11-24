import React from 'react';
import { Routes, Route } from 'react-router-dom';


const clientesRoutes = [
  //const { userRole } = useAuth();
  {path: "/clientes",
    element: <ClientesDashboard />, 
  },
  {path: "/Productos",
    element:  <Productos />,
  },
  {path: "/Carrito",
    element: <Carrito />,
  },
  {path: "/Pagos",
    element: <Pagos />,
  },
  {path: "/Ordenes",
    element: <Ordenes />,
  }, 
  {/* Agrega más rutas específicas para los clientes */}
]

export default clientesRoutes;