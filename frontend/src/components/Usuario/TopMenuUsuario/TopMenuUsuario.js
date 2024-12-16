import React from "react";
import { Menu, Image, Container, Button } from "semantic-ui-react";
import "./TopMenuUsuario.scss";

export function TopMenuUsuario() {
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
          <Button as="a" href="/login" className="login">
            Login
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
}
