import React, { useState } from "react";
import {
  Menu,
  Image,
  Container,
  Button,
  Dropdown,
  Modal,
  Icon,
} from "semantic-ui-react";
import { useAuth } from "../../hooks";
import { useNavigate, Link } from "react-router-dom";
import { Carrito } from "../Cliente/Carrito";
import { useCarrito } from "../../hooks/useCarrito";
import "./TopMenu.scss";

export function TopMenu() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const {
    carrito,
    loading,
    error,
    eliminarProducto,
    actualizarProducto,
    cargarCarrito,
  } = useCarrito(); // Usamos el hook para obtener el carrito
  const [open, setOpen] = useState(false); // Estado para el modal del carrito

  const handleLogout = () => {
    logout(); // Llamar la función de logout
    navigate("/productos"); // Redirigir al home
  };

  const handleOpen = () => setOpen(true); // Abre el modal
  const handleClose = () => setOpen(false); // Cierra el modal

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

        {/* Carrito de compras */}
        {(auth.user.rol === "cliente" || auth.user.rol === "staff") && (
          <>
            <Menu.Item className="top-menu__cart">
              <i
                className="pi pi-shopping-cart"
                style={{ color: "white" }}
                link
                onClick={handleOpen}
              ></i>
              {/* Este es el ícono del carrito, al hacer click se abrirá el modal */}
            </Menu.Item>
          </>
        )}

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

      {/* Modal del Carrito */}
      {(auth.user.rol === "cliente" || auth.user.rol === "staff") && (
        <>
          <Modal open={open} onClose={handleClose} size="large">
            <Modal.Header>Carrito de Compras</Modal.Header>
            <Modal.Content>
              {/* El componente Carrito recibe el carrito actualizado */}
              <Carrito
                carrito={carrito}
                loading={loading}
                error={error}
                eliminarProducto={eliminarProducto}
                actualizarProducto={actualizarProducto}
                cargarCarrito={cargarCarrito}
                showTotal={true}
              />{" "}
              {/* Pasamos el carrito actualizado */}
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={handleClose}>
                Cerrar
              </Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
    </Menu>
  );
}
