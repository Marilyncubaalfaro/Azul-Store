import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import { useShopData } from "../../hooks/useShopData";
import { requestJson } from "../../utils/api";
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

const ropaExploreSections = {
  "Ver todo": {
    title: "Selección completa",
    description:
      "Explora la colección completa de ropa con una mirada editorial y sin perder de vista la funcionalidad.",
    keywords: [],
  },
  "Blusas y camisas": {
    title: "Blusas y camisas",
    description:
      "Piezas ligeras y versátiles para construir looks pulidos en capas.",
    keywords: ["blusa", "camisa", "top"],
  },
  "Casacas y abrigos": {
    title: "Casacas y abrigos",
    description:
      "Silencios estructurados y piezas de abrigo para elevar cualquier conjunto.",
    keywords: ["casaca", "abrigo", "coat", "jacket"],
  },
  "Chompas y chalecos": {
    title: "Chompas y chalecos",
    description: "Texturas suaves y capas intermedias para un look más táctil.",
    keywords: ["chompa", "chaleco", "knit", "sweater"],
  },
  Vestidos: {
    title: "Vestidos",
    description: "Siluetas fluidas y femeninas para ocasiones de día o noche.",
    keywords: ["vestido", "dress"],
  },
  Pantalones: {
    title: "Pantalones",
    description:
      "Básicos limpios y líneas rectas para combinar con cualquier parte superior.",
    keywords: ["pantalon", "pant", "trouser"],
  },
  Enterizos: {
    title: "Enterizos",
    description:
      "Una sola pieza, una sola decisión. Looks resueltos con intención.",
    keywords: ["enterizo", "jumpsuit", "mono"],
  },
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesExploreSection(product, keywords) {
  if (!keywords.length) {
    return true;
  }

  const productCategories = Array.isArray(product.subcategories)
    ? product.subcategories
    : [];

  const normalizedCategories = productCategories.map((value) =>
    normalizeText(value),
  );

  if (
    keywords.some((keyword) =>
      normalizedCategories.includes(normalizeText(keyword)),
    )
  ) {
    return true;
  }

  const haystack = normalizeText(
    [product.name, product.brand, product.category].join(" "),
  );

  return keywords.some((keyword) => haystack.includes(normalizeText(keyword)));
}

export default function Shop() {
  const { category } = useParams();
  const [activeExplore, setActiveExplore] = useState("Ver todo");
  const [catalogProducts, setCatalogProducts] = useState([]);

  useScrollOnRouteChange();

  const { filteredProducts, categoryTitle, isLoading, error } =
    useShopData(category);

  useEffect(() => {
    let active = true;

    const loadCatalogProducts = async () => {
      if (category?.toLowerCase() !== "ropa") {
        setCatalogProducts([]);
        return;
      }

      try {
        const products = await requestJson("/products");

        if (active) {
          setCatalogProducts(Array.isArray(products) ? products : []);
        }
      } catch {
        if (active) {
          setCatalogProducts([]);
        }
      }
    };

    loadCatalogProducts();

    return () => {
      active = false;
    };
  }, [category]);

  const isRopa = category?.toLowerCase() === "ropa";
  const activeExploreConfig =
    ropaExploreSections[activeExplore] ?? ropaExploreSections["Ver todo"];

  const visibleProducts = useMemo(() => {
    if (!isRopa) {
      return filteredProducts;
    }

    if (activeExplore === "Ver todo" && catalogProducts.length > 0) {
      return catalogProducts;
    }

    return filteredProducts.filter((product) =>
      matchesExploreSection(product, activeExploreConfig.keywords),
    );
  }, [
    activeExplore,
    activeExploreConfig.keywords,
    catalogProducts,
    filteredProducts,
    isRopa,
  ]);

  const visibleMatchesCount = useMemo(() => {
    if (!isRopa) {
      return filteredProducts.length;
    }

    if (activeExplore === "Ver todo") {
      return catalogProducts.length > 0
        ? catalogProducts.length
        : filteredProducts.length;
    }

    return filteredProducts.filter((product) =>
      matchesExploreSection(product, activeExploreConfig.keywords),
    ).length;
  }, [
    activeExplore,
    activeExploreConfig.keywords,
    catalogProducts,
    filteredProducts,
    isRopa,
  ]);

  const featuredProducts = visibleProducts.slice(0, 3);
  const remainingProducts = visibleProducts.slice(3);

  return (
    <div className={`shop-page ${isRopa ? "shop-page-ropa" : ""}`}>
      {isRopa ? (
        <>
          <section className="shop-hero">
            <div className="shop-hero-copy">
              <span className="shop-eyebrow">Colección Ropa</span>
              <h1>{activeExploreConfig.title}</h1>
              <p>
                {activeExploreConfig.description} {ropaHero.description}
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
                    <button
                      type="button"
                      className={activeExplore === item ? "active" : ""}
                      onClick={() => setActiveExplore(item)}
                    >
                      {item}
                    </button>
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
                <span className="shop-ropa-count">
                  {visibleMatchesCount} producto
                  {visibleMatchesCount === 1 ? "" : "s"}
                </span>
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
                  {activeExplore !== "Ver todo" &&
                    visibleMatchesCount === 0 && (
                      <p className="shop-ropa-empty-note">
                        No hay coincidencias directas para esta selección.
                        Mostrando la colección completa.
                      </p>
                    )}

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
