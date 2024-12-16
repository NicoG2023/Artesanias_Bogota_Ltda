const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token requerido" });
  }

  // Extraer el token después de "Bearer "
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token mal formateado" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    req.user = decoded;
    next();
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        message:
          "No tienes permisos para realizar esta acción o acceder a esta ruta",
      });
    }
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
