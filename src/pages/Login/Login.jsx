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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
            <div className="password-field">
              <input
                id="account-password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle-btn"
                aria-label={
                  isPasswordVisible
                    ? "Ocultar contrasena"
                    : "Mostrar contrasena"
                }
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                {isPasswordVisible ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                    <path d="M12 5c-5.5 0-9.4 4-10.8 6.1a1.6 1.6 0 0 0 0 1.8C2.6 15 6.5 19 12 19s9.4-4 10.8-6.1a1.6 1.6 0 0 0 0-1.8C21.4 9 17.5 5 12 5Zm0 12c-4.5 0-7.8-3.1-9.2-5 1.4-1.9 4.7-5 9.2-5s7.8 3.1 9.2 5c-1.4 1.9-4.7 5-9.2 5Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                    <path d="M2.2 3.6 1 4.8l3.2 3.2A17.3 17.3 0 0 0 1.2 11a1.6 1.6 0 0 0 0 1.8C2.6 15 6.5 19 12 19c2 0 3.8-.5 5.3-1.3l2.9 2.9 1.2-1.2L2.2 3.6Zm9.8 13.7c-4.5 0-7.8-3.1-9.2-5 .7-.9 2.1-2.7 4.1-3.9l1.8 1.8a3 3 0 0 0 4.2 4.2l1.7 1.7a9.9 9.9 0 0 1-2.6.4Zm0-10.6c4.5 0 7.8 3.1 9.2 5-.6.9-1.8 2.4-3.4 3.5l-1.2-1.2A5 5 0 0 0 9 7.4L8 6.4c1.2-.5 2.6-.7 4-.7Z" />
                  </svg>
                )}
              </button>
            </div>

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
