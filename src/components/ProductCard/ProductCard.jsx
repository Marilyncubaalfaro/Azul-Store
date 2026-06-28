import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/price";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const sizes = useMemo(() => {
    if (Array.isArray(product.stockBySize) && product.stockBySize.length > 0) {
      return product.stockBySize.map((entry) => ({
        size: String(entry.size).toUpperCase(),
        stock: Number(entry.stock) || 0,
      }));
    }

    return [{ size: "UNICA", stock: Number(product.stock) || 0 }];
  }, [product.stockBySize, product.stock]);

  const [selectedSize, setSelectedSize] = useState(() => {
    const firstAvailable = sizes.find((entry) => entry.stock > 0);
    return firstAvailable?.size ?? sizes[0]?.size ?? "UNICA";
  });

  useEffect(() => {
    const hasSelectedSize = sizes.some((entry) => entry.size === selectedSize);
    if (!hasSelectedSize) {
      const firstAvailable = sizes.find((entry) => entry.stock > 0);
      setSelectedSize(firstAvailable?.size ?? sizes[0]?.size ?? "UNICA");
    }
  }, [selectedSize, sizes]);

  const selectedSizeStock =
    sizes.find((entry) => entry.size === selectedSize)?.stock ?? 0;

  const isOutOfStock = selectedSizeStock <= 0;
  const showLowStockWarning = selectedSizeStock > 0 && selectedSizeStock <= 2;

  const stockMessage = isOutOfStock
    ? `Sin stock en talla ${selectedSize}`
    : `Ultimas ${selectedSizeStock} unidades en talla ${selectedSize}`;

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

        <div
          className="size-selector"
          role="group"
          aria-label={`Tallas para ${product.name}`}
        >
          {sizes.map((entry) => (
            <button
              key={`${product.id}-${entry.size}`}
              type="button"
              className={`size-chip ${selectedSize === entry.size ? "active" : ""}`}
              onClick={() => setSelectedSize(entry.size)}
              aria-pressed={selectedSize === entry.size}
            >
              {entry.size}
            </button>
          ))}
        </div>

        {(isOutOfStock || showLowStockWarning) && (
          <p className="stock-alert">
            <small>{stockMessage}</small>
          </p>
        )}

        <button
          className="add-to-cart-btn"
          type="button"
          onClick={() => addToCart(product, selectedSize)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
