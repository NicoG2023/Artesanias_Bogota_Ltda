import React, { useEffect, useRef } from "react";
import { Table, Button, Icon, Loader } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "./Carrito.scss";

export function Carrito({
  carrito,
  loading,
  error,
  eliminarProducto,
  actualizarProducto,
  cargarCarrito,
}) {
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetched.current) {
      cargarCarrito();
      hasFetched.current = true;
    }
  }, []);

  if (loading) {
    return <Loader active inline="centered" content="Cargando carrito..." />;
  }

  if (error) {
    return <p>Error al cargar el carrito: {error}</p>;
  }

  if (!carrito.productos || carrito.productos.length === 0) {
    return <p className="carrito__vacio">El carrito está vacío</p>;
  }

  const handleEliminar = async (id) => {
    await eliminarProducto(id);
    await cargarCarrito();
  };

  const handleActualizarCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad > 0) {
      await actualizarProducto(id, nuevaCantidad);
      await cargarCarrito();
    }
  };

  const handleIrAPagar = () => {
    navigate("/resumen-orden");
  };

  const formatoColombiano = (valor) => {
    return new Intl.NumberFormat("es-CO").format(valor);
  };

  const subTotal = carrito.productos.reduce(
    (acc, item) =>
      acc +
      Number(item.precio.replace(".", "")) * item.REL_CarritoProducto.cantidad,
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
            <Table.HeaderCell>Sub Total</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {carrito.productos.map((producto) => (
            <Table.Row key={producto.id}>
              <Table.Cell>{producto.nombre}</Table.Cell>
              <Table.Cell>
                <Button
                  icon="minus"
                  onClick={() =>
                    handleActualizarCantidad(
                      producto.id,
                      producto.REL_CarritoProducto.cantidad - 1
                    )
                  }
                  disabled={
                    producto.REL_CarritoProducto.cantidad === 1 || loading
                  }
                />
                {producto.REL_CarritoProducto.cantidad}
                <Button
                  icon="plus"
                  onClick={() =>
                    handleActualizarCantidad(
                      producto.id,
                      producto.REL_CarritoProducto.cantidad + 1
                    )
                  }
                  disabled={loading}
                />
              </Table.Cell>
              <Table.Cell>${producto.precio}</Table.Cell>
              <Table.Cell>
                $
                {formatoColombiano(
                  Number(producto.precio.replace(".", "")) *
                    producto.REL_CarritoProducto.cantidad
                )}
              </Table.Cell>
              <Table.Cell>
                <Button
                  color="red"
                  icon
                  onClick={() => handleEliminar(producto.id)}
                  disabled={loading}
                >
                  <Icon name="trash" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Sub Total</Table.HeaderCell>
            <Table.HeaderCell>${formatoColombiano(subTotal)}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Footer>
      </Table>
      <div className="carrito__pago-container">
        <Button color="green" size="large" onClick={handleIrAPagar}>
          Ir a Pagar
        </Button>
      </div>
    </div>
  );
}
