const express = require('express');
const verifyToken = require('../middleware/auth'); // Importa el middleware de verificación de token

const router = express.Router();

// Rutas protegidas con el middleware verifyToken
router.get('/protected-data', verifyToken, (req, res) => {
    res.json({ message: 'Bienvenido al recurso protegido', user: req.user });
});

// Puedes agregar más rutas protegidas aquí
/*router.get('/another-protected-route', verifyToken, (req, res) => {
    res.json({ message: 'Esta es otra ruta protegida', user: req.user });
});*/

module.exports = router;