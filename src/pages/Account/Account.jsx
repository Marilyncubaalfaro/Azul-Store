import React, { useEffect, useMemo, useState } from "react";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import { useAuth } from "../../context/AuthContext";
import "./Account.css";

export default function Account() {
  useScrollOnRouteChange();
  const { user, logout, fetchCurrentUser, updateShippingAddress } = useAuth();
  const [addressForm, setAddressForm] = useState({
    line1: "",
    city: "",
    country: "",
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    fetchCurrentUser().catch(() => {
      // Si falla, seguimos mostrando los datos cacheados del contexto.
    });
  }, [fetchCurrentUser]);

  useEffect(() => {
    setAddressForm({
      line1: user?.address?.line1 || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
    });
  }, [user]);

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

  const handleAddressInputChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    setAddressError("");
    setIsSavingAddress(true);

    try {
      await updateShippingAddress({
        line1: addressForm.line1,
        city: addressForm.city,
        country: addressForm.country,
      });
      setIsEditingAddress(false);
    } catch (error) {
      setAddressError(
        error.message || "No se pudo guardar la direccion de envio.",
      );
    } finally {
      setIsSavingAddress(false);
    }
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

            {isEditingAddress ? (
              <form className="address-form" onSubmit={handleAddressSubmit}>
                <label htmlFor="shipping-line1">Direccion</label>
                <input
                  id="shipping-line1"
                  type="text"
                  value={addressForm.line1}
                  onChange={(event) =>
                    handleAddressInputChange("line1", event.target.value)
                  }
                  required
                  minLength={3}
                />

                <label htmlFor="shipping-city">Ciudad</label>
                <input
                  id="shipping-city"
                  type="text"
                  value={addressForm.city}
                  onChange={(event) =>
                    handleAddressInputChange("city", event.target.value)
                  }
                  required
                  minLength={2}
                />

                <label htmlFor="shipping-country">Pais</label>
                <input
                  id="shipping-country"
                  type="text"
                  value={addressForm.country}
                  onChange={(event) =>
                    handleAddressInputChange("country", event.target.value)
                  }
                  required
                  minLength={2}
                />

                {addressError && (
                  <p className="address-error">{addressError}</p>
                )}

                <div className="address-form-actions">
                  <button
                    className="profile-edit-btn"
                    type="button"
                    onClick={() => {
                      setIsEditingAddress(false);
                      setAddressError("");
                      setAddressForm({
                        line1: user?.address?.line1 || "",
                        city: user?.address?.city || "",
                        country: user?.address?.country || "",
                      });
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="add-to-cart-btn"
                    type="submit"
                    disabled={isSavingAddress}
                  >
                    {isSavingAddress ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <address>
                  {user?.address?.line1 || "Direccion no configurada"}
                  <br />
                  {user?.address?.city || "Ciudad no configurada"}
                  <br />
                  {user?.address?.country || "Pais no configurado"}
                </address>
                <button
                  className="profile-edit-btn"
                  onClick={() => setIsEditingAddress(true)}
                >
                  Editar direccion
                </button>
              </>
            )}
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
