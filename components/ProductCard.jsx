'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageUrl = product.image_url || product.image || '/images/bpc-157-300x300.webp';
  const priceFormatted = Number(product.price || 0).toFixed(2);

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -6, boxShadow: '0 20px 35px -8px rgba(16,18,20,0.12), 0 8px 16px -4px rgba(16,18,20,0.06)' }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <div className="thumb-container">
        <Link href={`/shop/${product.slug}`} className="thumb">
          <motion.img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.35 }}
          />
        </Link>
        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={isWishlisted ? '#e50914' : 'none'}
            stroke={isWishlisted ? '#e50914' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="product-card-body">
        {product.featured !== false && <span className="product-card-badge">Featured</span>}
        <Link href={`/shop/${product.slug}`} className="product-card-title-link">
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <p className="desc">{product.short_desc || product.desc}</p>
        <div className="price-row">
          <span className="price">${priceFormatted}</span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="product-add-cart-btn"
            onClick={() => addItem(product)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
