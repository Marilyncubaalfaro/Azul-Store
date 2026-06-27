import React from "react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/price";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      {product.badge && (
        <span className="badge">
          {product.badge.split("\n").map((text, index) => (
            <React.Fragment key={index}>
              {text}
              {index < product.badge.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      )}
      <img src={product.image} alt={product.name} />
      <div>
        <small>{product.brand}</small>
        <h3>{product.name}</h3>
        <p>
          <strong>{formatPrice(product.price)}</strong>{" "}
          {product.originalPrice && (
            <span>{formatPrice(product.originalPrice)}</span>
          )}
        </p>
        <button
          className="add-to-cart-btn"
          type="button"
          onClick={() => addToCart(product)}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
