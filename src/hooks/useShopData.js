import { useMemo } from "react";
import { PRODUCTS } from "../data/products";

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

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter(
        (product) => product.category.toLowerCase() === normalizedCategory,
      ),
    [normalizedCategory],
  );

  const categoryTitle = useMemo(
    () => getCategoryTitle(normalizedCategory),
    [normalizedCategory],
  );

  return { filteredProducts, categoryTitle };
}
