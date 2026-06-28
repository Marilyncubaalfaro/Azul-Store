import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import "./Register.css";

export default function Register() {
  useScrollOnRouteChange();

  const navigate = useNavigate();
  const { isAuthenticated, isCheckingSession, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    if (password !== confirmPassword) {
      setRegisterError("Las contrasenas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
      setRegisterSuccess("Registro completado. Ya puedes iniciar sesion.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login", { replace: true });
    } catch (error) {
      setRegisterError(error.message || "No se pudo completar el registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="register-page">
        <div className="register-status-card">Verificando sesion activa...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="register-page">
      <header className="register-header">
        <h1>Crear cuenta</h1>
        <p>
          Regístrate como usuario normal para comprar y guardar tus pedidos.
        </p>
      </header>

      <section className="register-section" aria-labelledby="register-title">
        <div className="register-card">
          <h2 id="register-title">Registro público</h2>
          <p className="register-hint">
            Este formulario crea una cuenta básica. El rol se asigna
            automáticamente como usuario.
          </p>

          <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="register-name">Nombre</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
            />

            <label htmlFor="register-email">Correo</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="register-password">Contraseña</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />

            <label htmlFor="register-password-confirm">
              Confirmar contraseña
            </label>
            <input
              id="register-password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
            />

            {registerError && <p className="register-error">{registerError}</p>}
            {registerSuccess && (
              <p className="register-success">{registerSuccess}</p>
            )}

            <button
              className="add-to-cart-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="register-login-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
