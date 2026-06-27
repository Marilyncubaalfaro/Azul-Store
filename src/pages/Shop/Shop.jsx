import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import './Shop.css';

export default function Shop() {
  const { category } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const filteredProducts = PRODUCTS.filter(
    (product) => product.category.toLowerCase() === category?.toLowerCase()
  );

  const getCategoryTitle = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'ropa':
        return 'Nuestra Colección de Ropa';
      case 'beachwear':
        return 'Colección Beachwear';
      case 'nightwear':
        return 'Colección Nightwear';
      default:
        return `Categoría: ${cat}`;
    }
  };

  return (
    <div className="shop-page" style={{ padding: '40px 20px' }}>
      <header className="shop-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '2px' }}>
          {getCategoryTitle(category)}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '10px' }}>
          Descubre las últimas tendencias y marcas exclusivas de Azul Store.
        </p>
      </header>

      {filteredProducts.length > 0 ? (
        <section className="products" style={{ padding: '0 40px 40px' }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <p>No se encontraron productos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
