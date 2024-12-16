import React, { useState, useEffect, useRef, createContext } from "react";
import { saveToken, getToken, removeToken } from "../api/token";
import { getMeApi } from "../api/usuario";

export const AuthContext = createContext({
  auth: null, // Estado inicial
  loading: true, // Para gestionar la carga inicial
  login: () => null,
  logout: () => null,
  updateUser: () => null,
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
      console.log("user login authcontext -->", user);
      setAuth({ token, user });
      return user; // Devuelve el usuario para manejar la redirección en el componente que llama a login
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setAuth(null);
      throw error;
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

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
