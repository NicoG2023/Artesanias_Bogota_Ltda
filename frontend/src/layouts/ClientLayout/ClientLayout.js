import React from "react";
import { useAuth } from "../../hooks";
import "./ClientLayout.scss";
import { Login } from "../../pages";
import { Footer } from "../../components/Footer";
import { TopMenu } from "../../components/TopMenu";

export function ClientLayout({ children }) {
  const { auth } = useAuth();
  if (!auth) return <Login />;
  return (
    <div className="client-layout">
      <div className="client-layout__topmenu">
        <TopMenu />
      </div>
      <div className="client-layout__main-content">
        <main>{children}</main>
      </div>
      <div className="client-layout__footer">
        <Footer />
      </div>
    </div>
  );
}
