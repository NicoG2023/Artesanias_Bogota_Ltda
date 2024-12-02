import Cookies from "js-cookie";
import { TOKEN } from "../utils/constants";

//Tiempo de expiracion del token (en dias)
const TOKEN_EXPIRATION_DAYS = 120; //SOLO EN DESARROLLO, EN PRODUCCION BAJAR A 2

/**
 * Guarda el token en una cookie segura.
 * @param {string} token - El token JWT.
 */
export const saveToken = (token) => {
  Cookies.set(TOKEN, token, {
    expires: TOKEN_EXPIRATION_DAYS, // Expira en 120 días
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "Strict", // Evita el envío del token en solicitudes entre sitios
    path: "/", // Disponible en toda la aplicación
  });
};

/**
 * Obtiene el token desde la cookie.
 * @returns {string|null} El token JWT o null si no existe.
 */
export const getToken = () => {
  return Cookies.get(TOKEN) || null;
};

/**
 * Elimina el token de la cookie.
 */
export const removeToken = () => {
  Cookies.remove(TOKEN, { path: "/" });
};
