/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'arada_cart_v2';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItems = (product, rows) => {
    setItems((prev) => {
      const next = prev.map((item) => ({ ...item }));
      rows.forEach(({ size, quantity }) => {
        if (quantity < 1) return;
        const index = next.findIndex((item) => item.productId === product._id && item.size === size);
        if (index >= 0) {
          next[index].quantity += quantity;
        } else {
          next.push({
            productId: product._id,
            name: product.name,
            slug: product.slug,
            image: product.image || null,
            price: product.price,
            size,
            quantity,
          });
        }
      });
      return next;
    });
  };

  const updateQuantity = (productId, size, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeItem = (productId, size) => {
    setItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItems, updateQuantity, removeItem, clearCart, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
