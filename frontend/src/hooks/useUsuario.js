import { useState } from "react";
import { solicitarResetPasswordApi, resetPasswordApi } from "../api/usuario";

export function useUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const solicitarResetPassword = async (email) => {
    try {
      setLoading(true);
      await solicitarResetPasswordApi(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await resetPasswordApi(token, newPassword);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { solicitarResetPassword, resetPassword, loading, error };
}
