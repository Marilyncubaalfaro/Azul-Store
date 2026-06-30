import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestJson } from "../../utils/api";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await requestJson("/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setMessage(response?.message || "Gracias por suscribirte a Azul Store.");
      setEmail("");
    } catch (error) {
      setMessage(error.message || "No se pudo procesar la suscripción.");
    } finally {
      setIsSubmitting(false);
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Suscribirse"}
        </button>
        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}
      </form>
    </footer>
  );
}
