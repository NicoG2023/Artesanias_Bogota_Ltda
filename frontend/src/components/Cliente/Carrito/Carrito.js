import React from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import "./Carrito.scss";
import { useCarrito } from "../../../hooks/useCarrito";

export function Carrito() {
  const { carrito, removeItem, clearCart } = useCarrito();

  if (!carrito.length) {
    return <p className="carrito__vacio">El carrito está vacío</p>;
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="carrito">
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Producto</Table.HeaderCell>
            <Table.HeaderCell>Cantidad</Table.HeaderCell>
            <Table.HeaderCell>Precio</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {carrito.map((producto) => (
            <Table.Row key={producto.id}>
              <Table.Cell>{producto.nombre}</Table.Cell>
              <Table.Cell>{producto.cantidad}</Table.Cell>
              <Table.Cell>${producto.precio.toFixed(2)}</Table.Cell>
              <Table.Cell>
                ${(producto.precio * producto.cantidad).toFixed(2)}
              </Table.Cell>
              <Table.Cell>
                <Button
                  color="red"
                  icon
                  onClick={() => removeItem(producto.id)}
                >
                  <Icon name="trash" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Total</Table.HeaderCell>
            <Table.HeaderCell>${total.toFixed(2)}</Table.HeaderCell>
            <Table.HeaderCell>
              <Button color="red" onClick={clearCart}>
                Vaciar Carrito
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}
