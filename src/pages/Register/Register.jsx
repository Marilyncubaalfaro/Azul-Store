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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(digitsOnly);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    if (!/^9\d{8}$/.test(phone)) {
      setRegisterError(
        "Ingresa un celular de Peru valido (9 digitos, por ejemplo 912345678).",
      );
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Las contrasenas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password, phone);
      setRegisterSuccess("Registro completado. Ya puedes iniciar sesion.");
      setName("");
      setEmail("");
      setPhone("");
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

            <label htmlFor="register-phone">Celular (Peru)</label>
            <input
              id="register-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="912345678"
              value={phone}
              onChange={handlePhoneChange}
              minLength={9}
              maxLength={9}
              pattern="9[0-9]{8}"
              required
            />

            <label htmlFor="register-password">Contraseña</label>
            <div className="password-field">
              <input
                id="register-password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="new-password"
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
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
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
