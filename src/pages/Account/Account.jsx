import React, { useEffect, useMemo, useState } from "react";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import { useAuth } from "../../context/AuthContext";
import "./Account.css";

export default function Account() {
  useScrollOnRouteChange();
  const {
    user,
    isAuthenticated,
    isCheckingSession,
    login,
    logout,
    fetchCurrentUser,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser().catch(() => {
        // Si falla, seguimos mostrando los datos de user entregados por refresh/login.
      });
    }
  }, [isAuthenticated, fetchCurrentUser]);

  const joinDate = useMemo(() => {
    if (!user?.createdAt) {
      return "No disponible";
    }

    const date = new Date(user.createdAt);
    return Number.isNaN(date.getTime())
      ? "No disponible"
      : date.toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
        });
  }, [user]);

  const handleLoginSubmit = async (event) => {
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

  const handleLogout = async () => {
    setLoginError("");
    await logout();
  };

  if (isCheckingSession) {
    return (
      <div className="account-page">
        <div className="account-status-card">Verificando sesion activa...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <header className="account-header">
          <h1>Mi Cuenta</h1>
          <p>
            Inicia sesion para ver tu perfil, historial de pedidos y
            direcciones.
          </p>
        </header>

        <section className="login-section" aria-labelledby="login-title">
          <div className="login-card">
            <h2 id="login-title">Iniciar sesion</h2>
            <p className="login-hint">
              Usa el email y clave con los que te registraste en Azul Store.
            </p>

            <form className="login-form" onSubmit={handleLoginSubmit}>
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
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Mi Cuenta</h1>
        <p>Bienvenido de vuelta, {user?.name || "Cliente Azul"}.</p>
      </header>

      <div className="account-container">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <h2>Detalles de Perfil</h2>
            <p>
              <strong>Nombre:</strong> {user?.name || "Sin nombre"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "Sin email"}
            </p>
            <p>
              <strong>Socio desde:</strong> {joinDate}
            </p>
            <button
              className="add-to-cart-btn profile-logout-btn"
              onClick={handleLogout}
            >
              Cerrar sesion
            </button>
          </div>

          <div className="profile-address">
            <h2>Direccion de envio</h2>
            <address>
              Av. Larco 123, Dpto 402
              <br />
              Miraflores, Lima
              <br />
              Peru
            </address>
            <button
              className="profile-edit-btn"
              onClick={() => alert("Editar direccion")}
            >
              Editar direccion
            </button>
          </div>
        </aside>

        <section className="orders-section">
          <h2>Historial de Pedidos</h2>
          <div className="orders-list">
            <div className="order-card">
              <div className="order-card-header">
                <span>
                  Pedido <strong>#AZ-9824</strong>
                </span>
                <span className="order-status">Entregado</span>
              </div>
              <div className="order-card-body">
                <div>
                  <p>Fecha: 15 de Junio, 2026</p>
                  <p>Items: 1x Conjunto Ivory</p>
                </div>
                <strong>S/ 180.70</strong>
              </div>
            </div>

            <div className="order-card">
              <div className="order-card-header">
                <span>
                  Pedido <strong>#AZ-9510</strong>
                </span>
                <span className="order-status">Entregado</span>
              </div>
              <div className="order-card-body">
                <div>
                  <p>Fecha: 02 de Enero, 2026</p>
                  <p>Items: 1x Vestido Astra</p>
                </div>
                <strong>S/ 277.20</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
