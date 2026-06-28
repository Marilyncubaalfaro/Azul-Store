import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { requestJson } from "../../utils/api";
import { formatPrice } from "../../utils/price";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import ProductCard from "../../components/ProductCard";
import "./ProductDetail.css";

function normalizeSizeStock(product) {
  if (Array.isArray(product?.stockBySize) && product.stockBySize.length > 0) {
    return product.stockBySize.map((entry) => ({
      size: String(entry.size).toUpperCase(),
      stock: Number(entry.stock) || 0,
    }));
  }

  return [{ size: "UNICA", stock: Number(product?.stock) || 0 }];
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("UNICA");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useScrollOnRouteChange();

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [data, offers] = await Promise.all([
          requestJson(`/products/${encodeURIComponent(id)}`),
          requestJson("/products?offers=true"),
        ]);

        if (!active) {
          return;
        }

        setProduct(data);
        setRelatedProducts(
          Array.isArray(offers)
            ? offers.filter((item) => item.id !== data.id).slice(0, 5)
            : [],
        );
        setActiveImageIndex(0);

        const sizes = normalizeSizeStock(data);
        const firstAvailable = sizes.find((entry) => entry.stock > 0);
        setSelectedSize(firstAvailable?.size ?? sizes[0]?.size ?? "UNICA");
        setQuantity(1);
      } catch (requestError) {
        if (active) {
          setProduct(null);
          setRelatedProducts([]);
          setError(requestError.message || "No se pudo cargar el producto.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const sizes = useMemo(() => normalizeSizeStock(product), [product]);

  useEffect(() => {
    const exists = sizes.some((entry) => entry.size === selectedSize);

    if (!exists) {
      const firstAvailable = sizes.find((entry) => entry.stock > 0);
      setSelectedSize(firstAvailable?.size ?? sizes[0]?.size ?? "UNICA");
      setQuantity(1);
    }
  }, [selectedSize, sizes]);

  const selectedSizeStock =
    sizes.find((entry) => entry.size === selectedSize)?.stock ?? 0;
  const isOutOfStock = selectedSizeStock <= 0;
  const showLowStockWarning = selectedSizeStock > 0 && selectedSizeStock <= 2;

  useEffect(() => {
    if (quantity > selectedSizeStock && selectedSizeStock > 0) {
      setQuantity(selectedSizeStock);
    }
    if (selectedSizeStock <= 0) {
      setQuantity(1);
    }
  }, [quantity, selectedSizeStock]);

  const handleAddToCart = () => {
    if (!product || isOutOfStock) {
      return;
    }

    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock) {
      return;
    }

    addToCart(product, selectedSize, quantity);
    navigate("/cart");
  };

  const discount =
    product?.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const allImages = [
      ...(Array.isArray(product.images) ? product.images : []),
      product.image,
    ];

    const uniqueImages = Array.from(
      new Set(
        allImages.map((value) => String(value || "").trim()).filter(Boolean),
      ),
    );

    return uniqueImages.slice(0, 5);
  }, [product]);

  const activeImage = galleryImages[activeImageIndex] ?? product?.image;

  if (isLoading) {
    return (
      <section className="product-detail-page">
        <p className="product-detail-message">Cargando producto...</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="product-detail-page">
        <p className="product-detail-message product-detail-message-error">
          {error || "Producto no encontrado."}
        </p>
      </section>
    );
  }

  return (
    <section className="product-detail-page">
      <article className="product-detail-card">
        <div className="product-detail-gallery-wrap">
          <div className="product-detail-thumbs" aria-label="Miniaturas">
            {galleryImages.map((image, index) => (
              <button
                key={`${product.id}-thumb-${index}`}
                type="button"
                className={`product-detail-thumb ${
                  index === activeImageIndex ? "active" : ""
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image} alt={`${product.name} vista ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="product-detail-media">
            {product.badge && (
              <span className="product-detail-badge">{product.badge}</span>
            )}
            <img src={activeImage} alt={product.name} />
          </div>
        </div>

        <div className="product-detail-content">
          <small className="product-detail-brand">{product.brand}</small>
          <h1>{product.name}</h1>

          <p className="product-detail-price">
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice && (
              <span>{formatPrice(product.originalPrice)}</span>
            )}
          </p>

          <ul className="product-detail-meta">
            <li>SKU: AZ-{String(product.id).padStart(4, "0")}</li>
            <li>Categoria: {String(product.category).toUpperCase()}</li>
            <li>
              Disponibilidad en talla {selectedSize}: {selectedSizeStock}{" "}
              unidades
            </li>
            {discount !== null && <li>Descuento actual: {discount}%</li>}
          </ul>

          <div className="product-detail-selector">
            <p>Talla</p>
            <div
              className="product-detail-sizes"
              role="group"
              aria-label="Seleccionar talla"
            >
              {sizes.map((entry) => (
                <button
                  key={`${product.id}-${entry.size}`}
                  type="button"
                  className={`size-chip ${selectedSize === entry.size ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSize(entry.size);
                    setQuantity(1);
                  }}
                >
                  {entry.size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail-selector">
            <p>Cantidad</p>
            <div className="product-detail-qty">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={isOutOfStock}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) => Math.min(selectedSizeStock, prev + 1))
                }
                disabled={isOutOfStock || quantity >= selectedSizeStock}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-detail-payment-box">
            <p>Hasta 6 cuotas sin intereses con</p>
            <div className="product-detail-payment-logos">
              <span>Diners Club</span>
              <span>BBVA</span>
            </div>
          </div>

          {(isOutOfStock || showLowStockWarning) && (
            <p className="product-detail-stock-alert">
              {isOutOfStock
                ? `Sin stock en talla ${selectedSize}`
                : `Ultimas ${selectedSizeStock} unidades en talla ${selectedSize}`}
            </p>
          )}

          <button
            className="add-to-cart-btn"
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Agotado" : `Agregar ${quantity} al carrito`}
          </button>
          <button
            className="buy-now-btn"
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            Comprar ahora
          </button>

          <p className="product-detail-pickup-note">
            Recogida disponible en Azul Store San Isidro listo en 24 horas.
          </p>
        </div>
      </article>

      {relatedProducts.length > 0 && (
        <section
          className="product-detail-related"
          aria-label="Productos relacionados"
        >
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </section>
      )}
    </section>
  );
}
