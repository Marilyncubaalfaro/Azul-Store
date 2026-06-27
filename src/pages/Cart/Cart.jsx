import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/price";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();

  useScrollOnRouteChange();

  return (
    <div className="cart-page" style={{ padding: "40px 45px 80px" }}>
      <header className="cart-header" style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Tu Carrito de Compras
        </h1>
      </header>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
            Tu carrito está vacío.
          </p>
          <Link
            to="/"
            className="add-to-cart-btn"
            style={{
              textDecoration: "none",
              display: "inline-block",
              padding: "10px 20px",
            }}
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div
          className="cart-container"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "40px",
          }}
        >
          <div
            className="cart-items-list"
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item"
                style={{
                  display: "flex",
                  gap: "20px",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "20px",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "110px",
                    objectFit: "cover",
                    background: "var(--soft)",
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <small style={{ color: "var(--muted)", fontSize: "10px" }}>
                    {item.brand}
                  </small>
                  <h3
                    style={{
                      margin: "4px 0 6px",
                      fontSize: "14px",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    <strong>{formatPrice(item.price)}</strong>
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{
                      border: "1px solid #141414",
                      background: "transparent",
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{
                      border: "1px solid #141414",
                      background: "transparent",
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#ce3d28",
                    cursor: "pointer",
                    fontSize: "13px",
                    textDecoration: "underline",
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              style={{
                alignSelf: "flex-start",
                background: "transparent",
                border: "1px solid #ce3d28",
                color: "#ce3d28",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "12px",
                marginTop: "10px",
                borderRadius: "999px",
              }}
            >
              Vaciar Carrito
            </button>
          </div>

          <div
            className="cart-summary"
            style={{
              background: "var(--paper)",
              border: "1px solid #141414",
              padding: "24px",
              height: "fit-content",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                textTransform: "uppercase",
                marginBottom: "20px",
                borderBottom: "1px solid #141414",
                paddingBottom: "10px",
              }}
            >
              Resumen del Pedido
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <span>Subtotal:</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <span>Envío:</span>
              <span style={{ color: "#ce3d28", fontWeight: "bold" }}>
                Gratis
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: "bold",
                borderTop: "2px solid #141414",
                paddingTop: "15px",
                marginBottom: "20px",
              }}
            >
              <span>Total:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <button
              className="add-to-cart-btn"
              style={{ width: "100%", padding: "12px", fontSize: "13px" }}
              onClick={() =>
                alert("¡Gracias por tu compra simulada en Azul Store!")
              }
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
