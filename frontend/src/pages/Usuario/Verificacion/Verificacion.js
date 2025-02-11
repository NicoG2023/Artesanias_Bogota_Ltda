import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verificarUsuarioApi } from "../../../api/usuario";

export function Verificacion() {
  const [mensaje, setMensaje] = useState("Verificando cuenta...");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token de verificación no válido.");
      return;
    }

    async function verificar() {
      try {
        console.log("token", token);
        const response = await verificarUsuarioApi(token);
        console.log("Respuesta de verificación:", response); // Debug
        setMensaje(response.message || "Cuenta verificada exitosamente.");
        setTimeout(() => navigate("/login"), 3000); // Redirige en 3 segundos
      } catch (err) {
        console.error("Error en verificación:", err); // Debug
        setError(err.message || "Error al verificar cuenta.");
      }
    }

    verificar();
  }, [token, navigate]);

  return (
    <div className="verificacion-container">
      <h1>{error ? "Error" : "¡Éxito!"}</h1>
      <p>{error || mensaje}</p>
    </div>
  );
}
