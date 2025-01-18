import React from "react";
import { useAuth } from "../../hooks";
import { Login } from "../../pages";
import { TopMenu, Footer, SideMenu } from "../../components";
import "./StaffLayout.scss";

export function StaffLayout({ children }) {
  const { auth } = useAuth();

  if (!auth) return <Login />;
  return (
    <div className="staff-layout">
      {/* Top Menu */}
      <div className="staff-layout__topmenu">
        <TopMenu />
      </div>

      {/* Contenedor para side menu + contenido */}
      <div className="staff-layout__content">
        {/* Menú lateral */}
        <div className="staff-layout__side-menu">
          <SideMenu />
        </div>

        {/* Contenido principal */}
        <div className="staff-layout__main-content">{children}</div>
      </div>

      {/* Footer */}
      <div className="staff-layout__footer">
        <Footer />
      </div>
    </div>
  );
}
