import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks";
import "./SideMenu.scss";

export function SideMenu() {
  const { auth } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="side-menu-admin">
      <Menu vertical className="side">
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
          to="/admin-analiticas"
          active={pathname === "/admin-analiticas"}
        >
          <Icon name="chart line" /> Analíticas
        </Menu.Item>
      </Menu>
    </div>
  );
}
