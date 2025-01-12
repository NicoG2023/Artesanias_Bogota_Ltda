import React from "react";
import { Modal, Button, Icon, Form } from "semantic-ui-react";
import "./ModalProductoAdmin.scss";

export function ModalProductoAdmin({ producto, open, onClose}) {
  if (!producto) return null;

  const handleSave = () => {
    console.log(producto)
  };
  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar el producto?")) {
      window.alert("Producto eliminado");
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="modal-product">
      <Modal.Content className="modal-product__content">
        {/* Botón de cerrar en la esquina superior derecha */}
        <Button icon className="modal-product__close-button" onClick={onClose}>
          <Icon name="close" />
        </Button>
        <div className="modal-product__image-container">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="modal-product__image"
          />
        </div>

        <div className="modal-product__details">
          <Form>
            <Form.Input
              label="Nombre"
              name="nombre"
              defaultValue={producto.nombre}
            />
            <Form.Input
              label="SKU"
              name="sku"
              defaultValue={producto.sku}
            />
            <Form.Input
              label="Precio"
              name="precio"
              type="number"
              defaultValue={producto.precio}
            />
            <Form.Input
              label="Color"
              name="color"
              defaultValue={producto.color}
            />
            <Form.Input
              label="Talla"
              name="talla"
              defaultValue={producto.talla}
            />
            <Form.TextArea
              label="Descripción"
              name="descripcion"
              defaultValue={producto.descripcion}
            />
            <Form.Input
              label="Categorías"
              name="categorias"
              defaultValue={producto.categorias.map(c => c.nombre).join(", ")}
              readOnly
            />
            <Form.Input
              label="URL de la Imagen"
              name="imagen"
              defaultValue={producto.imagen}
            />
          </Form>
          <div className="modal-product__footer">
            <Button color="red" onClick={handleDelete}>
              <Icon name="trash" />
              Eliminar producto
            </Button>
            <Button color="green" onClick={handleSave}>
              <Icon name="save" />
              Guardar cambios
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}