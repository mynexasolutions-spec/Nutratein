'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -6, boxShadow: '0 16px 34px rgba(16,18,20,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <Link href={`/shop/${product.slug}`} className="thumb" style={{ overflow: 'hidden' }}>
        <motion.img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
      </Link>
      {product.featured && <span className="badge">Featured</span>}
      <Link href={`/shop/${product.slug}`}>
        <h3>{product.name}</h3>
      </Link>
      <p className="desc">{product.short_desc}</p>
      <div className="price-row">
        <span className="price">${Number(product.price).toFixed(2)}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="btn btn-dark btn-sm"
          onClick={() => addItem(product)}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
