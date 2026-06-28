import React, { useEffect, useMemo, useState } from "react";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import { useAuth } from "../../context/AuthContext";
import { requestJson } from "../../utils/api";
import { formatPrice } from "../../utils/price";
import "./Account.css";

export default function Account() {
  useScrollOnRouteChange();
  const { user, accessToken, logout, fetchCurrentUser, updateShippingAddress } =
    useAuth();
  const [addressForm, setAddressForm] = useState({
    line1: "",
    city: "",
    country: "",
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const isAdmin = user?.roles?.includes("admin");

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

  useEffect(() => {
    if (!accessToken) {
      setOrders([]);
      setIsLoadingOrders(false);
      return;
    }

    let active = true;

    const loadOrders = async () => {
      setIsLoadingOrders(true);
      setOrdersError("");

      try {
        if (isAdmin) {
          if (active) {
            setOrders([]);
          }
          return;
        }

        const data = await requestJson("/orders/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (active) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (active) {
          setOrders([]);
          setOrdersError(
            error.message || "No se pudo cargar el historial de pedidos.",
          );
        }
      } finally {
        if (active) {
          setIsLoadingOrders(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [accessToken, isAdmin]);

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

  const formatOrderDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Fecha no disponible";
    }

    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatItemsSummary = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) {
      return "Sin items";
    }

    return items
      .map((item) => {
        const size = item.size ? ` talla ${item.size}` : "";
        return `${item.quantity}x ${item.productName}${size}`;
      })
      .join(", ");
  };

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

          {!isAdmin && (
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
          )}
        </aside>

        {!isAdmin && (
          <section className="orders-section">
            <h2>Historial de Pedidos</h2>

            {isLoadingOrders ? (
              <p className="orders-message">Cargando pedidos...</p>
            ) : ordersError ? (
              <p className="orders-error">{ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="orders-message">
                Aun no tienes pedidos registrados.
              </p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div
                    className="order-card"
                    key={order._id || order.orderNumber}
                  >
                    <div className="order-card-header">
                      <span>
                        Pedido <strong>{order.orderNumber}</strong>
                      </span>
                      <span className="order-status">
                        {order.status || "En proceso"}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <div>
                        <p>Fecha: {formatOrderDate(order.createdAt)}</p>
                        <p>Items: {formatItemsSummary(order.items)}</p>
                      </div>
                      <strong>{formatPrice(Number(order.total) || 0)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
