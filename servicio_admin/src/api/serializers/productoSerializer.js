const productoSerializer = (producto) => {
  return {
    id: producto.id,
    nombre: producto.nombre,
    sku: producto.sku,
    precio: producto.precio,
    descripcion: producto.descripcion,
    imagen: producto.imagen,
    es_activo: producto.es_activo,
    color: producto.color,
    talla: producto.talla,
    categoria: producto.Categoria
      ? { id: producto.Categoria.id, nombre: producto.Categoria.nombre }
      : null,
  };
};

module.exports = productoSerializer;
