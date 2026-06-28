import React, { useEffect, useMemo } from "react";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import { useAuth } from "../../context/AuthContext";
import "./Account.css";

export default function Account() {
  useScrollOnRouteChange();
  const { user, logout, fetchCurrentUser } = useAuth();

  useEffect(() => {
    fetchCurrentUser().catch(() => {
      // Si falla, seguimos mostrando los datos cacheados del contexto.
    });
  }, [fetchCurrentUser]);

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

  const handleLogout = async () => {
    await logout();
  };

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
