import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const normalizeSizeStock = (product) => {
    if (Array.isArray(product.stockBySize) && product.stockBySize.length > 0) {
      return product.stockBySize.map((entry) => ({
        size: String(entry.size).toUpperCase(),
        stock: Number(entry.stock) || 0,
      }));
    }

    return [{ size: "UNICA", stock: Number(product.stock) || 0 }];
  };

  const getStockForSize = (product, selectedSize) => {
    const stockBySize = normalizeSizeStock(product);
    return stockBySize.find((entry) => entry.size === selectedSize)?.stock ?? 0;
  };

  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem("azul_store_cart");
    const parsed = localData ? JSON.parse(localData) : [];

    return parsed.map((item) => {
      const selectedSize = item.selectedSize || "UNICA";
      const cartKey = item.cartKey || `${item.id}:${selectedSize}`;

      return {
        ...item,
        selectedSize,
        cartKey,
        stockForSize: Number(item.stockForSize) || 0,
      };
    });
  });

  useEffect(() => {
    localStorage.setItem("azul_store_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedSize, quantity = 1) => {
    setCartItems((prevItems) => {
      const size = (selectedSize || "UNICA").toUpperCase();
      const stockForSize = getStockForSize(product, size);
      const unitsToAdd = Math.max(1, Number(quantity) || 1);

      if (stockForSize <= 0) {
        return prevItems;
      }

      const cartKey = `${product.id}:${size}`;
      const existingItem = prevItems.find((item) => item.cartKey === cartKey);

      if (existingItem) {
        const maxStock = existingItem.stockForSize ?? 0;
        if (existingItem.quantity >= maxStock) {
          return prevItems;
        }

        const nextQuantity = Math.min(
          existingItem.quantity + unitsToAdd,
          maxStock,
        );

        return prevItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: nextQuantity } : item,
        );
      }

      const initialQuantity = Math.min(unitsToAdd, stockForSize);

      return [
        ...prevItems,
        {
          ...product,
          selectedSize: size,
          cartKey,
          stockForSize,
          quantity: initialQuantity,
        },
      ];
    });
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartKey !== cartKey),
    );
  };

  const updateQuantity = (cartKey, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.cartKey === cartKey) {
            if (amount > 0 && item.quantity >= (item.stockForSize ?? 0)) {
              return item;
            }

            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
