const { Producto, Categoria } = require("../../models");
const express = require("express");
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

module.exports = { obtenerFiltros };
