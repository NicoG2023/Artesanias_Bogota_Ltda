const { Producto, Categoria } = require("../../models");
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

module.exports = { obtenerFiltros, agregarCategorias };
