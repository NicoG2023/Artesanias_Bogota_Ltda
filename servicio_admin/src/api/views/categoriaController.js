const { Producto, Categoria } = require("../../models");
const express = require("express");
const sequelize = require("../../config/database");
const { Op } = require("sequelize");

const obtenerFiltros = async (req, res) => {
  try {
    // Obtener nombre de las categorías
    const categorias = await Categoria.findAll({
      attributes: ["nombre"],
    });

    // Obtener colores únicos de los productos
    const colores = await Producto.findAll({
      attributes: [[sequelize.literal("DISTINCT(color)"), "color"]],
      where: { color: { [Op.not]: null } }, // Excluir valores nulos
    });

    res.json({
      categorias: categorias.map((cat) => cat.nombre),
      colores: colores.map((col) => col.color),
    });
  } catch (error) {
    console.error("Error al obtener categorías y colores:", error);
    res.status(500).json({ error: "Error al obtener categorías y colores" });
  }
};

module.exports = { obtenerFiltros };
