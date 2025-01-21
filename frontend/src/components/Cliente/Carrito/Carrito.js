import React, { useEffect } from "react";
import { Table, Button, Icon, Loader } from "semantic-ui-react";
import { useCarrito } from "../../../hooks/useCarrito";
import "./Carrito.scss";

export function Carrito() {
  const {
    carrito,
    loading,
    error,
    cargarCarrito,
    eliminarProducto,
    actualizarProducto,
  } = useCarrito();

  // Cargar el carrito al montar el componente
  useEffect(() => {
    cargarCarrito();
  }, []);

  if (loading) {
    return <Loader active inline="centered" content="Cargando carrito..." />;
  }

  if (error) {
    return <p>Error al cargar el carrito: {error}</p>;
  }

  if (!carrito || carrito.length === 0) {
    return <p className="carrito__vacio">El carrito está vacío</p>;
  }

  const handleEliminar = (id) => {
    eliminarProducto(id);
  };

  const handleActualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad > 0) {
      actualizarProducto(id, nuevaCantidad);
    }
  };

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
              <Table.Cell>
                <Button
                  icon="minus"
                  onClick={() =>
                    handleActualizarCantidad(
                      producto.id,
                      producto.cantidad - 1
                    )
                  }
                  disabled={producto.cantidad === 1}
                />
                {producto.cantidad}
                <Button
                  icon="plus"
                  onClick={() =>
                    handleActualizarCantidad(
                      producto.id,
                      producto.cantidad + 1
                    )
                  }
                />
              </Table.Cell>
              <Table.Cell>${producto.precio.toFixed(2)}</Table.Cell>
              <Table.Cell>
                ${(producto.precio * producto.cantidad).toFixed(2)}
              </Table.Cell>
              <Table.Cell>
                <Button
                  color="red"
                  icon
                  onClick={() => handleEliminar(producto.id)}
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
            <Table.HeaderCell />
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}
