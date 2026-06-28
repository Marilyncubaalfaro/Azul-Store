import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import { useShopData } from "../../hooks/useShopData";
import "./Shop.css";

const ropaMenu = [
  "Blusas y camisas",
  "Casacas y abrigos",
  "Chompas y chalecos",
  "Vestidos",
  "Pantalones",
  "Enterizos",
  "Ver todo",
];

const ropaHero = {
  title: "Una selección con aire editorial",
  description:
    "Piezas versátiles, texturas suaves y siluetas pensadas para combinarse con facilidad durante toda la temporada.",
  image:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
};

export default function Shop() {
  const { category } = useParams();

  useScrollOnRouteChange();

  const { filteredProducts, categoryTitle, isLoading, error } =
    useShopData(category);

  const isRopa = category?.toLowerCase() === "ropa";
  const featuredProducts = filteredProducts.slice(0, 3);
  const remainingProducts = filteredProducts.slice(3);

  return (
    <div className={`shop-page ${isRopa ? "shop-page-ropa" : ""}`}>
      {isRopa ? (
        <>
          <section className="shop-hero">
            <div className="shop-hero-copy">
              <span className="shop-eyebrow">Colección Ropa</span>
              <h1>{categoryTitle}</h1>
              <p>
                {ropaHero.description} Encuentra looks para oficina, día a día y
                eventos con una curaduría limpia y femenina.
              </p>
            </div>

            <div className="shop-hero-image">
              <img
                src={ropaHero.image}
                alt="Inspiración de la colección ropa"
              />
            </div>
          </section>

          <section className="shop-ropa-editorial">
            <aside className="shop-ropa-nav" aria-label="Subcategorías de ropa">
              <p>Explora</p>
              <ul>
                {ropaMenu.map((item) => (
                  <li key={item}>
                    <button type="button">{item}</button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="shop-ropa-featured">
              <div className="shop-ropa-featured-header">
                <h2>Inspiración editorial</h2>
                <p>
                  Una selección pensada para que la categoría Ropa se sienta más
                  cercana a un lookbook.
                </p>
              </div>

              {isLoading ? (
                <div className="shop-state shop-state-loading">
                  <p>Cargando productos...</p>
                </div>
              ) : error ? (
                <div className="shop-state shop-state-error">
                  <p>{error}</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="shop-ropa-grid shop-ropa-grid-featured">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {remainingProducts.length > 0 && (
                    <section className="shop-ropa-grid shop-ropa-grid-regular">
                      {remainingProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </section>
                  )}
                </>
              ) : (
                <div className="shop-state shop-state-empty">
                  <p>No se encontraron productos en esta categoría.</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          <header className="shop-header">
            <h1>{categoryTitle}</h1>
            <p>
              Descubre las últimas tendencias y marcas exclusivas de Azul Store.
            </p>
          </header>

          {isLoading ? (
            <div className="shop-state shop-state-loading">
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="shop-state shop-state-error">
              <p>{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <section className="products shop-products-default">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          ) : (
            <div className="shop-state shop-state-empty">
              <p>No se encontraron productos en esta categoría.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
