'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '@/lib/shopData';

const CartContext = createContext(null);
const STORAGE_KEY = 'dragopharma_cart_v1';

export function resolveProductImage(product) {
  if (product?.image_url && !product.image_url.includes('placeholder')) {
    return product.image_url;
  }
  const rawName = (product?.product_name || product?.name || '').toLowerCase();
  const cleanName = rawName.replace(/[^a-z0-9]/g, '');
  const rawSlug = (product?.product_slug || product?.slug || '').toLowerCase();
  const cleanSlug = rawSlug.replace(/[^a-z0-9]/g, '');
  const id = String(product?.product_id || product?.id || '').toLowerCase();

  const match = PRODUCTS.find((p) => {
    const pCleanName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pCleanSlug = p.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pId = p.id.toLowerCase();

    return (
      (id && (pId === id || pCleanSlug === id)) ||
      (cleanSlug && (pCleanSlug === cleanSlug || pCleanName === cleanSlug)) ||
      (cleanName && (
        pCleanName === cleanName ||
        pCleanSlug === cleanName ||
        pCleanName.includes(cleanName) ||
        cleanName.includes(pCleanName)
      ))
    );
  });
  return match?.image_url || '/images/fragment-1-300x300.webp';
}

function loadCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.map((item) => ({
      ...item,
      image_url: resolveProductImage(item),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (product, quantity = 1) => {
    const resolvedImage = resolveProductImage(product);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id || (product.name && i.name === product.name));
      if (existing) {
        return prev.map((i) =>
          (i.id === product.id || (product.name && i.name === product.name))
            ? { ...i, quantity: i.quantity + quantity, image_url: i.image_url || resolvedImage }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug || '',
          price: product.price,
          image_url: resolvedImage,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = { items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount, hydrated };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
