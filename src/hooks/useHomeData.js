import { useEffect, useState } from "react";
import { requestJson } from "../utils/api";

export function useHomeData() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadHomeData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [offers, brandsData] = await Promise.all([
          requestJson("/products?offers=true"),
          requestJson("/products/brands"),
        ]);

        if (active) {
          setProducts(Array.isArray(offers) ? offers : []);
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        }
      } catch (requestError) {
        if (active) {
          setProducts([]);
          setBrands([]);
          setError(
            requestError.message || "No se pudieron cargar los productos.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  return {
    products,
    brands,
    isLoading,
    error,
  };
}
