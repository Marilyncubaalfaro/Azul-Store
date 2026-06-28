import { useEffect, useMemo, useState } from "react";
import { requestJson } from "../utils/api";

export function getCategoryTitle(category) {
  switch (category?.toLowerCase()) {
    case "ropa":
      return "Nuestra Colección de Ropa";
    case "beachwear":
      return "Colección Beachwear";
    case "nightwear":
      return "Colección Nightwear";
    default:
      return `Categoría: ${category}`;
  }
}

export function useShopData(category) {
  const normalizedCategory = category?.toLowerCase() || "";
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const products = await requestJson(
          `/products?category=${encodeURIComponent(normalizedCategory)}`,
        );
        if (active) {
          setFilteredProducts(Array.isArray(products) ? products : []);
        }
      } catch (requestError) {
        if (active) {
          setFilteredProducts([]);
          setError(requestError.message || "No se pudo cargar la categoria.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    if (!normalizedCategory) {
      setFilteredProducts([]);
      setIsLoading(false);
      setError("");
      return () => {
        active = false;
      };
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [normalizedCategory]);

  const categoryTitle = useMemo(
    () => getCategoryTitle(normalizedCategory),
    [normalizedCategory],
  );

  return { filteredProducts, categoryTitle, isLoading, error };
}
