import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import { useShopData } from "../../hooks/useShopData";
import "./Shop.css";

export default function Shop() {
  const { category } = useParams();

  useScrollOnRouteChange();

  const { filteredProducts, categoryTitle, isLoading, error } =
    useShopData(category);

  return (
    <div className="shop-page" style={{ padding: "40px 20px" }}>
      <header
        className="shop-header"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {categoryTitle}
        </h1>
        <p
          style={{ color: "var(--muted)", fontSize: "13px", marginTop: "10px" }}
        >
          Descubre las últimas tendencias y marcas exclusivas de Azul Store.
        </p>
      </header>

      {isLoading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--muted)",
          }}
        >
          <p>Cargando productos...</p>
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#b12f22",
          }}
        >
          <p>{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <section className="products" style={{ padding: "0 40px 40px" }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--muted)",
          }}
        >
          <p>No se encontraron productos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
