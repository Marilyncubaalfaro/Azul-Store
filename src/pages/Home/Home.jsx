import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS, BRANDS } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import './Home.css';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Un pequeño retraso asegura que el DOM se haya renderizado
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <>
      <section className="hero" aria-label="Coleccion destacada">
        <img
          src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=85"
          alt="Modelo con blazer caminando en ciudad"
        />
        <div className="hero-copy">
          <h1>AUTENTICA</h1>
          <p>FW26</p>
        </div>
      </section>

      <section className="intro">
        <h2>Concept store de Marcas internacionales</h2>
        <p>
          Descubre una experiencia exclusiva donde el estilo, la personalidad y
          la moda contemporanea de alta calidad se unen para ofrecerte lo mejor
          en cada prenda.
        </p>
      </section>

      <section className="brands" id="brands">
        <h2>Our Brands</h2>
        <div className="brand-strip" aria-label="Marcas">
          {BRANDS.map((brand, idx) => (
            <span key={idx}>{brand}</span>
          ))}
        </div>
      </section>

      <section className="products" id="fiestas" aria-label="Productos destacados">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <section className="stores">
        <div className="store-copy">
          <h2>CONOCE NUESTRAS CONCEPT STORES EN:</h2>
          <address>
            <strong>Av. Jose Larco 812, Miraflores, Lima</strong>
            <span>lunes a sabado, 10 a.m. a 7 p.m.</span>
          </address>
          <address>
            <strong>Av. Conquistadores 456, San Isidro, Lima</strong>
            <span>lunes a sabado, 10 a.m. a 10 p.m.</span>
          </address>
        </div>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1100&q=85"
          alt="Interior de boutique con ropa colgada"
        />
      </section>

      <section className="service-row" aria-label="Beneficios">
        <span>Marcas Exclusivas</span>
        <span>Todos los medios de pago</span>
        <span>Envios a todo el Peru</span>
      </section>
    </>
  );
}
