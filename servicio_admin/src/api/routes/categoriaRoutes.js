const express = require("express");
const {
  agregarCategorias,
  obtenerCategorias,
  agregarCategoria,
  actualizarCategoria,
  eliminarCategoria,
  relacionarProductoCategoria,
} = require("../views/categoriaController");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../../middleware/auth");
/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Endpoints para gestionar Categorias
 */
/**
 * @swagger
 * /categorias/agregar-categorias:
 *   post:
 *     summary: Agregar múltiples categorías
 *     tags: [Categorias]
 *     description: Crea categorías en lote a partir de un arreglo de objetos. Requiere rol admin o superadmin.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *             example:
 *               categorias:
 *                 - nombre: "Joyas"
 *                 - nombre: "Esculturas"
 *                 - nombre: "Cerámica"
 *     responses:
 *       201:
 *         description: Categorías agregadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *       400:
 *         description: Error de validación (arreglo vacío o no se envió 'categorias')
 *       401:
 *         description: Sin autorización (falta token o roles)
 *       500:
 *         description: Error al agregar categorías
 */
router.post(
  "/categorias/agregar-categorias",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  agregarCategorias
);

/**
 * @swagger
 * /categorias/plantilla:
 *   get:
 *     summary: Descargar plantilla para subir categorías
 *     tags: [Categorias]
 *     description: Devuelve un archivo JSON con la estructura necesaria para la carga masiva de categorías.
 *     responses:
 *       200:
 *         description: Plantilla descargada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categorias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 */
router.get("/categorias/plantilla", (req, res) => {
  // Configuramos cabeceras para que el navegador lo descargue como archivo
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="plantilla_categorias.json"'
  );
  res.setHeader("Content-Type", "application/json");

  // Estructura base de la plantilla
  const plantilla = {
    categorias: [
      { nombre: "Joyas" },
      { nombre: "Esculturas" },
      { nombre: "Cerámica" },
    ],
  };

  // Enviamos la respuesta como JSON
  res.status(200).json(plantilla);
});

router.get(
  "/categorias/obtener-categorias",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  obtenerCategorias
);

router.post(
  "/categorias/agregar-categoria",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  agregarCategoria
);

router.put(
  "/categorias/actualizar-categoria/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  actualizarCategoria
);

router.delete(
  "/categorias/eliminar-categoria/:id",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  eliminarCategoria
);

router.post(
  "/categorias/relacionar-producto-categoria",
  verifyToken,
  authorizeRoles("admin", "superadmin"),
  relacionarProductoCategoria
);

module.exports = router;
