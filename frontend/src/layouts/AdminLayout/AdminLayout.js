import React from "react";
import "./AdminLayout.scss";
import { useAuth } from "../../hooks";

export function AdminLayout({ children }) {
  const { auth } = useAuth();
}
