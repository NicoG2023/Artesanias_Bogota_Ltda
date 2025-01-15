import React from "react";
import { Menu, Image, Container, Button, Dropdown, Popup, Icon } from "semantic-ui-react";
import { useAuth } from "../../hooks";
import { Carrito } from "../Cliente/Carrito";
import "./TopMenu.scss";

export function TopMenu() {
  const { auth, logout } = useAuth();

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

        {/* Carrito de compras */}
        <Menu.Item className="top-menu__cart">
          <Popup
            trigger={
              <Icon name="shopping cart" size="large" link />
            }
            content={<Carrito showTotal={false} />}
            on="click"
            position="bottom right"
            className="cart-popup"
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
              <Dropdown.Item text="Logout" icon="sign-out" onClick={logout} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
}
