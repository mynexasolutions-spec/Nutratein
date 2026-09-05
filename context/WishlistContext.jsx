'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { resolveProductImage } from './CartContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'nutratein_wishlist_v1';

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setWishlist(
          parsed.map((item) => ({
            ...item,
            image_url: resolveProductImage(item),
          }))
        );
      }
    } catch (e) {
      console.error('Error loading wishlist:', e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist, hydrated]);

  const isInWishlist = (id) => {
    if (!id) return false;
    return wishlist.some((item) => item.id === id || item.slug === id);
  };

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id || p.slug === product.slug);
      if (exists) {
        return prev.filter((p) => p.id !== product.id && p.slug !== product.slug);
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug || '',
          price: Number(product.price || 0),
          image_url: resolveProductImage(product),
          category: product.category || product.category_slug || '',
          short_desc: product.short_desc || product.desc || '',
        },
      ];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const value = {
    wishlist,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    hydrated,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
