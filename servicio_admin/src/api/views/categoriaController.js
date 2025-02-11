const { Producto, Categoria, REL_ProductoCategoria } = require("../../models");
const sequelize = require("../../config/database");
const { Op } = require("sequelize");

const obtenerFiltros = async (req, res) => {
  try {
    // Obtener id y nombre de las categorías
    const categorias = await Categoria.findAll({
      attributes: ["id", "nombre"], // Incluir id y nombre
    });

    // Obtener colores únicos de los productos
    const colores = await Producto.findAll({
      attributes: [[sequelize.literal("DISTINCT(color)"), "color"]],
      where: { color: { [Op.not]: null } }, // Excluir valores nulos
    });

    res.json({
      categorias: categorias.map((cat) => ({
        id: cat.id,
        nombre: cat.nombre,
      })), // Enviar ambos valores como un objeto
      colores: colores.map((col) => col.color),
    });
  } catch (error) {
    console.error("Error al obtener categorías y colores:", error);
    res.status(500).json({ error: "Error al obtener categorías y colores" });
  }
};

const agregarCategorias = async (req, res) => {
  try {
    const { categorias } = req.body;

    // Validación básica
    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
      return res.status(400).json({
        error:
          "Debes enviar un arreglo de categorías en el campo 'categorias'.",
      });
    }

    // Crear categorías en lote
    // bulkCreate insertará todas las filas de una sola vez
    // Si 'nombre' es único y hay duplicados, lanzará un error que atrapamos en el catch
    const nuevasCategorias = await Categoria.bulkCreate(categorias);

    return res.status(201).json({
      message: "Categorías agregadas correctamente",
      data: nuevasCategorias,
    });
  } catch (error) {
    console.error("Error al agregar categorías:", error);
    return res.status(500).json({
      error: "Ocurrió un error al agregar las categorías",
      detalle: error.message || error,
    });
  }
};

const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      attributes: ["id", "nombre"],
    });

    return res.status(200).json({ data: categorias });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({ error: "Error al obtener categorías" });
  }
};

const agregarCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre de la categoría es obligatorio." });
    }

    const nuevaCategoria = await Categoria.create({ nombre });

    return res.status(201).json({
      message: "Categoría creada exitosamente",
      data: nuevaCategoria,
    });
  } catch (error) {
    console.error("Error al agregar categoría:", error);
    return res.status(500).json({ error: "Error al agregar categoría" });
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    categoria.nombre = nombre || categoria.nombre;
    await categoria.save();

    return res.status(200).json({
      message: "Categoría actualizada exitosamente",
      data: categoria,
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return res.status(500).json({ error: "Error al actualizar categoría" });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Eliminar relaciones en REL_ProductoCategoria
    await REL_ProductoCategoria.destroy({ where: { categoria_fk: id } });

    // Eliminar la categoría
    await categoria.destroy();

    return res
      .status(200)
      .json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return res.status(500).json({ error: "Error al eliminar categoría" });
  }
};

const relacionarProductoCategoria = async (req, res) => {
  try {
    const { productoId, categoriaId } = req.body;

    // Validar que el producto y la categoría existan
    const producto = await Producto.findByPk(productoId);
    const categoria = await Categoria.findByPk(categoriaId);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Crear la relación
    const relacion = await REL_ProductoCategoria.create({
      producto_fk: productoId,
      categoria_fk: categoriaId,
    });

    return res.status(201).json({
      message: "Producto relacionado a la categoría exitosamente",
      data: relacion,
    });
  } catch (error) {
    console.error("Error al relacionar producto con categoría:", error);
    return res
      .status(500)
      .json({ error: "Error al relacionar producto con categoría" });
  }
};

const obtenerProductosNoRelacionados = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Obtener productos ya relacionados con la categoría
    const productosRelacionados = await REL_ProductoCategoria.findAll({
      attributes: ["producto_fk"],
      where: { categoria_fk: categoriaId },
      raw: true,
    });

    // Extraer los IDs de los productos relacionados
    const productosRelacionadosIds = productosRelacionados.map(
      (rel) => rel.producto_fk
    );

    // Buscar productos que NO estén en la lista de productos relacionados y que sean activos
    const productosNoRelacionados = await Producto.findAll({
      where: {
        id: {
          [Op.notIn]: productosRelacionadosIds.length
            ? productosRelacionadosIds
            : [-1],
        },
        es_activo: true, // Filtrar solo productos activos
      },
      attributes: ["id", "nombre", "sku", "precio", "es_activo"],
    });

    return res.status(200).json({
      data: productosNoRelacionados,
    });
  } catch (error) {
    console.error("Error al obtener productos no relacionados:", error);
    return res.status(500).json({
      error: "Error al obtener productos no relacionados con la categoría",
    });
  }
};

const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Obtener productos relacionados con la categoría
    const productosRelacionados = await REL_ProductoCategoria.findAll({
      attributes: ["producto_fk"],
      where: { categoria_fk: categoriaId },
      raw: true,
    });

    // Extraer los IDs de los productos relacionados
    const productosRelacionadosIds = productosRelacionados.map(
      (rel) => rel.producto_fk
    );

    // Buscar productos que están en la lista de productos relacionados
    const productos = await Producto.findAll({
      where: {
        id: {
          [Op.in]: productosRelacionadosIds.length
            ? productosRelacionadosIds
            : [-1], // Si no hay productos, devolver una lista vacía
        },
        es_activo: true, // Solo productos activos
      },
      attributes: ["id", "nombre", "sku", "precio", "es_activo"],
    });

    return res.status(200).json({
      data: productos,
    });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return res.status(500).json({
      error: "Error al obtener productos relacionados con la categoría",
    });
  }
};

const desvincularProductoCategoria = async (req, res) => {
  try {
    const { productoId, categoriaId } = req.params;

    // Verificar si la relación existe
    const relacion = await REL_ProductoCategoria.findOne({
      where: { producto_fk: productoId, categoria_fk: categoriaId },
    });

    if (!relacion) {
      return res
        .status(404)
        .json({ error: "La relación producto-categoría no existe" });
    }

    // Eliminar la relación
    await relacion.destroy();

    return res
      .status(200)
      .json({ message: "Producto desvinculado correctamente" });
  } catch (error) {
    console.error("Error al desvincular producto de la categoría:", error);
    return res
      .status(500)
      .json({ error: "Error al desvincular producto de la categoría" });
  }
};

module.exports = {
  obtenerFiltros,
  agregarCategorias,
  obtenerCategorias,
  agregarCategoria,
  actualizarCategoria,
  eliminarCategoria,
  relacionarProductoCategoria,
  obtenerProductosNoRelacionados,
  obtenerProductosPorCategoria,
  desvincularProductoCategoria,
};
