import "./AdminLayout.scss";
import { useAuth } from "../../hooks";
import { Login } from "../../pages";

export function AdminLayout({ children }) {
  const { auth } = useAuth();
  if (!auth) return <Login />;
}
