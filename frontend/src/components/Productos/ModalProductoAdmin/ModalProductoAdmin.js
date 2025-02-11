import React from "react";
import { Modal, Button, Icon, Form } from "semantic-ui-react";
import { desactivarProducto, editarProducto } from "../../../api/productos";
import "./ModalProductoAdmin.scss";

export function ModalProductoAdmin({ producto, open, onClose}) {
  if (!producto) return null;

  const handleSave = () => {
    if(window.confirm("¿Estás seguro de que deseas guardar los cambios?")){
      editarProducto(producto.id, producto);
      window.alert("Cambios guardados");
      window.location.reload();
    }
  };
  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar el producto?")) {
      desactivarProducto(producto.id);
      window.alert("Producto eliminado");
      window.location.reload();
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
              defaultValue={producto.categorias.map(c => c.nombre).join(", ") || "Sin categorías"}
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
            <Button color="green" onClick={handleSave} disabled={!producto.es_activo}>
              <Icon name="save" />
              Guardar cambios
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}