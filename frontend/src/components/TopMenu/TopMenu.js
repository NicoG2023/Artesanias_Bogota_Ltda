import React from "react";
import { Menu, Image, Container, Button, Dropdown } from "semantic-ui-react";
import { useAuth } from "../../hooks";
import { useNavigate, Link } from "react-router-dom";
import "./TopMenu.scss";

export function TopMenu() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llamar la función de logout
    navigate("/productos"); // Redirigir al home
  };

  return (
    <Menu borderless className="top-menu">
      <Container fluid className="top-menu__container">
        <Menu.Item className="top-menu__button">
          <Button as={Link} to="/productos" className="brand">
            Artesanías Bogotá Ltda.
          </Button>
        </Menu.Item>

        <Menu.Item className="top-menu__banner">
          <Image
            src="/images/artesanias-banner.png"
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
                onClick={() => navigate("/perfil")}
              />

              {/* Solo visible si rol es "cliente" */}
              {auth?.user?.rol === "cliente" && (
                <Dropdown.Item
                  text="Mis Órdenes"
                  icon="shopping cart"
                  onClick={() => navigate("/ordenes-cliente")}
                />
              )}

              <Dropdown.Item
                text="Logout"
                icon="sign-out"
                onClick={handleLogout} // Redirigir al presionar logout
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
}
