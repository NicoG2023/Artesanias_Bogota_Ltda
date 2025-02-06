const express = require("express");
const {
    updateNombreApellido,
    updateEmail,
    updateContrasena,
} = require("../views/perfilController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");
const router = express.Router();


router.put(
    "/perfil-update-nombre-apellido",
    verifyToken,
    authorizeRoles("admin", "superadmin","staff","cliente"),
    updateNombreApellido
);


router.put(
    "/perfil-update-email",
    verifyToken,
    authorizeRoles("admin", "superadmin","staff","cliente"),
    updateEmail
);

router.put(
    "/perfil-update-contrasena",
    verifyToken,
    authorizeRoles("admin", "superadmin","staff","cliente"),
    updateContrasena
);


module.exports = router;