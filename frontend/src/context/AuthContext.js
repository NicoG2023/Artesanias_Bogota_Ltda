import React, { useState, useEffect, useRef, createContext } from "react";
import { saveToken, getToken, removeToken } from "../utils/authToken";
import { getMeApi } from "../api/user";

export const AuthContext = createContext({
  auth: null, // Estado inicial
  loading: true, // Para gestionar la carga inicial
  login: () => null,
  logout: () => null,
  updateUser: () => null,
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga inicial
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const user = await getMeApi(token);
          setAuth({ token, user });
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setAuth(null);
        }
      } else {
        setAuth(null);
      }
      setLoading(false); // Finaliza la carga
    };

    if (!isInitialized.current) {
      isInitialized.current = true;
      initializeAuth();
    }
  }, []);

  const login = async (token) => {
    saveToken(token);
    try {
      const user = await getMeApi(token);
      setAuth({ token, user });
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setAuth(null);
    }
  };

  const logout = () => {
    removeToken();
    setAuth(null);
  };

  const updateUser = (updatedUser) => {
    setAuth((prevAuth) => ({
      ...prevAuth,
      user: { ...prevAuth.user, ...updatedUser },
    }));
  };

  if (loading) return null; // Mostrar nada mientras carga

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
