import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks";
import "./SideMenu.scss";

export function SideMenu() {
  const { auth } = useAuth();
  const { pathname } = useLocation();
  console.log("ROL:", auth);

  return (
    <div className="side-menu-admin">
      {/* Solo visible para usuarios con rol "admin" */}
      <Menu vertical className="side">
        {auth.user.rol === "admin" && (
          <>
            <Menu.Item as={Link} to="/admin" active={pathname === "/admin"}>
              <Icon name="home" /> Dashboard
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/admin-usuarios"
              active={pathname === "/admin-usuarios"}
            >
              <Icon name="address book outline" /> Gestionar Usuarios
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/admin-ordenes"
              active={pathname === "/admin-ordenes"}
            >
              <Icon name="list alternate outline" /> Gestionar Órdenes
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/admin-inventario"
              active={pathname === "/admin-inventario"}
            >
              <Icon name="warehouse" /> Gestionar Inventario
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/admin-puntos-venta"
              active={pathname === "/admin-puntos-venta"}
            >
              <Icon name="shop" /> Gestionar Puntos de Venta
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/admin-analiticas"
              active={pathname === "/admin-analiticas"}
            >
              <Icon name="chart line" /> Analíticas
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/admin-agregar-info"
              active={pathname === "/admin-analiticas"}
            >
              <Icon name="upload" /> Agregar Información
            </Menu.Item>
          </>
        )}
        {/* Solo visible para usuarios con rol "staff" */}
        {auth.user.rol === "staff" && (
          <>
            <Menu.Item
              as={Link}
              to="/staff-dashboard"
              active={pathname === "/staff-dashboard"}
            >
              <Icon name="home" /> Dashboard
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/productos-staff"
              active={pathname === "/productos-staff"}
            >
              <Icon name="box" /> Productos Staff
            </Menu.Item>
          </>
        )}
      </Menu>
    </div>
  );
}
