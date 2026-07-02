import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestJson } from "../../utils/api";
import "./Footer.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (isSubmitting) {
      return;
    }

    if (!trimmedEmail) {
      setMessageType("error");
      setMessage("Ingresa un correo electronico para suscribirte.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setMessageType("error");
      setMessage("Ingresa un correo electronico valido.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await requestJson("/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      setMessageType("success");
      setMessage(response?.message || "Gracias por suscribirte a Azul Store.");
      setEmail("");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "No se pudo procesar la suscripción.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (message) {
      setMessage("");
    }
  };

  return (
    <footer className="site-footer">
      <div>
        <h2>Azul Store</h2>
        <Link to="/sobre-nosotros">Sobre nosotros</Link>
        <Link to="/nuestras-tiendas">Nuestras tiendas</Link>
        <Link to="/contacto">Contacto</Link>
      </div>
      <div>
        <h2>Shop</h2>
        <Link to="/shop/ropa">Ropa</Link>
        <Link to="/shop/beachwear">Beachwear</Link>
        <Link to="/shop/nightwear">Nightwear</Link>
        <Link to="/accesorios">Accesorios</Link>
        <a href="/#brands">Brands</a>
      </div>
      <div>
        <h2>Centro de Ayuda</h2>
        <Link to="/terminos">Términos y condiciones</Link>
        <Link to="/privacidad">Políticas de privacidad</Link>
        <Link to="/envio">Políticas de envío</Link>
        <Link to="/reclamaciones">Libro de reclamaciones</Link>
      </div>
      <form className="newsletter" onSubmit={handleSubscribe}>
        <h2>Suscribete a nuestra revista y se parte de Azul store.</h2>
        <p>Noticias exclusivas, 20% de descuento en el primer pedido.</p>
        <label>
          <span className="sr-only">Correo electronico</span>
          <input
            type="email"
            placeholder="Correo electronico"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            required
          />
        </label>
        <button type="submit" disabled={isSubmitting || !email.trim()}>
          {isSubmitting ? "Enviando..." : "Suscribirse"}
        </button>
        {message && (
          <p
            className={`form-message ${messageType === "error" ? "form-message--error" : "form-message--success"}`}
            role="status"
          >
            {message}
          </p>
        )}
      </form>
    </footer>
  );
}
