import React, { useState } from "react";
import { Menu, Image, Container, Button, Dropdown, Modal, Icon } from "semantic-ui-react";
import { useAuth } from "../../hooks";
import { Carrito } from "../Cliente/Carrito";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import "./TopMenu.scss";

export function TopMenu() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { carrito } = useCarrito(); // Usamos el hook para obtener el carrito
  const [open, setOpen] = useState(false); // Estado para el modal del carrito

  const handleLogout = () => {
    logout(); // Llamar la función de logout
    navigate("/"); // Redirigir al home
  };

  const handleOpen = () => setOpen(true);  // Abre el modal
  const handleClose = () => setOpen(false); // Cierra el modal

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
          <Icon name="shopping cart" size="large" link onClick={handleOpen} />
          {/* Este es el ícono del carrito, al hacer click se abrirá el modal */}
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
                  onClick={() => (window.location.href = "/ordenes-cliente")}
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

      {/* Modal del Carrito */}
      <Modal open={open} onClose={handleClose} size="large">
        <Modal.Header>Carrito de Compras</Modal.Header>
        <Modal.Content>
          {/* El componente Carrito recibe el carrito actualizado */}
          <Carrito carrito={carrito} showTotal={true} /> {/* Pasamos el carrito actualizado */}
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Actions>
      </Modal>
    </Menu>
  );
}
