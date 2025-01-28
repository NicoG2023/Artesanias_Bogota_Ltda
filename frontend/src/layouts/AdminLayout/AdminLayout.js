// AdminLayout.jsx
import React from "react";
import { useAuth } from "../../hooks";
import { AdminDashboard, Login } from "../../pages";
import { TopMenu, Footer, SideMenu } from "../../components";
import "./AdminLayout.scss";

export function AdminLayout({ children }) {
  const { auth } = useAuth();

  if (!auth) return <Login />;

  return (
    <div className="admin-layout">
      {/* Top Menu */}
      <div className="admin-layout__topmenu">
        <TopMenu />
      </div>

      {/* Contenedor para side menu + contenido */}
      <div className="admin-layout__content">
        {/* Menú lateral */}
        <div className="admin-layout__side-menu">
          <SideMenu />
        </div>

        {/* Contenido principal */}
        <div className="admin-layout__main-content">{children || <AdminDashboard />}</div>
      </div>

      {/* Footer */}
      <div className="admin-layout__footer">
        <Footer />
      </div>
    </div>
  );
}
