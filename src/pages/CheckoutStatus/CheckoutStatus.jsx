import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { requestJson } from "../../utils/api";
import "./CheckoutStatus.css";

function getTitleByType(type) {
  if (type === "success") {
    return "Pago aprobado";
  }

  if (type === "pending") {
    return "Pago pendiente";
  }

  return "Pago rechazado";
}

function getDescriptionByType(type) {
  if (type === "success") {
    return "Estamos confirmando tu orden. Esto puede tardar unos segundos.";
  }

  if (type === "pending") {
    return "Mercado Pago aun esta procesando tu pago. Puedes revisar el estado mas tarde.";
  }

  return "El pago no se completo. Puedes volver al carrito para intentarlo nuevamente.";
}

export default function CheckoutStatus({ type }) {
  const location = useLocation();
  const { accessToken, isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const externalReference = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("ref") || params.get("external_reference") || "";
  }, [location.search]);

  useEffect(() => {
    if (
      type !== "success" ||
      !externalReference ||
      !isAuthenticated ||
      !accessToken
    ) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const pollStatus = async () => {
      attempts += 1;
      setIsCheckingStatus(true);

      try {
        const response = await requestJson(
          `/orders/mercadopago/status/${encodeURIComponent(externalReference)}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (cancelled) {
          return;
        }

        if (response?.processedOrder) {
          clearCart();
          setStatusMessage("Pago confirmado y orden registrada correctamente.");
          setIsCheckingStatus(false);
          return;
        }

        if (response?.errorMessage) {
          setStatusMessage(response.errorMessage);
          setIsCheckingStatus(false);
          return;
        }

        if (attempts >= 8) {
          setStatusMessage(
            "El pago fue aprobado, pero la orden aun se esta sincronizando. Revisa tu cuenta en unos minutos.",
          );
          setIsCheckingStatus(false);
          return;
        }

        setTimeout(pollStatus, 2500);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatusMessage(
          error.message ||
            "No se pudo verificar el estado de la orden en este momento.",
        );
        setIsCheckingStatus(false);
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
    };
  }, [accessToken, clearCart, externalReference, isAuthenticated, type]);

  return (
    <section className="checkout-status-page">
      <div className="checkout-status-card">
        <p className="checkout-status-eyebrow">Mercado Pago</p>
        <h1>{getTitleByType(type)}</h1>
        <p>{getDescriptionByType(type)}</p>

        {isCheckingStatus && (
          <p className="checkout-status-note">
            Validando estado de tu orden...
          </p>
        )}
        {statusMessage && (
          <p className="checkout-status-note">{statusMessage}</p>
        )}

        <div className="checkout-status-actions">
          <Link to="/account">Ir a mi cuenta</Link>
          <Link to="/cart">Volver al carrito</Link>
        </div>
      </div>
    </section>
  );
}
