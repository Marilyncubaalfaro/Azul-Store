import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import "./Login.css";

export default function Login() {
  useScrollOnRouteChange();

  const { isAuthenticated, isCheckingSession, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      setPassword("");
    } catch (error) {
      setLoginError(error.message || "No se pudo iniciar sesion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="login-page">
        <div className="login-status-card">Verificando sesion activa...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Mi Cuenta</h1>
        <p>
          Inicia sesion para ver tu perfil, historial de pedidos y direcciones.
        </p>
      </header>

      <section className="login-section" aria-labelledby="login-title">
        <div className="login-card">
          <h2 id="login-title">Iniciar sesion</h2>
          <p className="login-hint">
            Usa el email y clave con los que te registraste en Azul Store.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="account-email">Correo</label>
            <input
              id="account-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="account-password">Contrasena</label>
            <input
              id="account-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />

            {loginError && <p className="login-error">{loginError}</p>}

            <button
              className="add-to-cart-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <p className="login-register-link">
            ¿Eres nuevo? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
