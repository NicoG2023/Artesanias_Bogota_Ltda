import React from "react";
import { Menu, Image, Container, Button, Dropdown } from "semantic-ui-react";
import { useAuth } from "../../hooks";
import "./TopMenu.scss";

export function TopMenu() {
  const { auth, logout } = useAuth();
  console.log("rol del user: ", auth?.user?.rol);

  return (
    <Menu borderless className="top-menu">
      <Container fluid className="top-menu__container">
        <Menu.Item className="top-menu__button">
          <Button as="a" href="/" className="brand">
            Artesanías Bogotá Ltda.
          </Button>
        </Menu.Item>

        <Menu.Item className="top-menu__banner">
          <Image
            src="../../../images/artesanias-banner.png"
            alt="Artesanías Banner"
            fluid
            className="banner-image"
          />
        </Menu.Item>

        <Menu.Item className="top-menu__button">
          <Dropdown
            text={auth?.user?.nombre || "Usuario"}
            className="auth-dropdown"
          >
            <Dropdown.Menu>
              <Dropdown.Item
                text="Perfil"
                icon="user"
                onClick={() => (window.location.href = "/perfil")}
              />

              {/* Solo visible si rol es "cliente" */}
              {auth?.user?.rol === "cliente" && (
                <Dropdown.Item
                  text="Mis Órdenes"
                  icon="shopping cart"
                  onClick={() => (window.location.href = "/Ordenes-cliente")}
                />
              )}

              <Dropdown.Item text="Logout" icon="sign-out" onClick={logout} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
}
