import React from "react";
import { useAuth } from "../../hooks";
import "./ClientLayout.scss";
import { Login } from "../../pages";
import { TopMenu, Footer } from "../../components";

export function ClientLayout({ children }) {
  const { auth } = useAuth();
  if (!auth) return <Login />;
  return (
    <div className="client-layout">
      <div className="client-layout__topmenu">
        <TopMenu />
      </div>
      <div className="client-layout__main-content">{children}</div>
      <div className="client-layout__footer">
        <Footer />
      </div>
    </div>
  );
}
