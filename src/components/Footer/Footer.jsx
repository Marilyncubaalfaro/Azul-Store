import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setMessage('Gracias por suscribirte a Azul Store.');
      setEmail('');
    } else {
      setMessage('');
    }
  };

  return (
    <footer className="site-footer">
      <div>
        <h2>Azul Store</h2>
        <a href="#sobre-nosotros">sobre nosotros</a>
        <a href="#nuestras-tiendas">Nuestras tiendas</a>
        <a href="#contacto">Contacto</a>
      </div>
      <div>
        <h2>Shop</h2>
        <Link to="/shop/ropa">Ropa</Link>
        <Link to="/shop/beachwear">Beachwear</Link>
        <Link to="/shop/nightwear">Nightwear</Link>
        <a href="#accesorios">Accesorios</a>
        <a href="/#brands">Brands</a>
      </div>
      <div>
        <h2>Centro de Ayuda</h2>
        <a href="#terminos">Terminos y condiciones</a>
        <a href="#privacidad">Politicas de privacidad</a>
        <a href="#envio">Politicas de envio</a>
        <a href="#reclamaciones">Libro de reclamaciones</a>
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
        <button type="submit">Suscribirse</button>
        {message && <p className="form-message" role="status">{message}</p>}
      </form>
    </footer>
  );
}
