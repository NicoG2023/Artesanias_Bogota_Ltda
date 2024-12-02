import React from "react";
import { useAuth } from "../../hooks";
import "./ClientLayout.scss";

export function ClientLayout({ children }) {
  const { auth } = useAuth();
  return (
    <div className="client-layout">
      <div className="client-layout__content">{children}</div>
    </div>
  );
}
