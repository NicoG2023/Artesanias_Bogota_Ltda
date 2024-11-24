import React from 'react';
import { Routes, Route } from 'react-router-dom';


const staffRoutes = [
  //const { userRole } = useAuth();
  {path: "/empleados",
   element: <StaffDashboard />, 
  },
  {path: "/Productos",
    element:  <Productos />,
  },
  {path: "/Pagos",
    element: <Pagos />,
  },
  {path: "/Ordenes",
    element: <Ordenes />,
  },
  {path: "/Informes",
    element: <Informes />,
  }, 
  {/* Agrega más rutas específicas para usuarios */}
]

export default staffRoutes;