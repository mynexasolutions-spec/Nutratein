'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Reveal from '@/components/Reveal.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from('products')
      .select('*, categories(name,slug)')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        if (active) {
          setProduct(data);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="container section"><p>Loading…</p></div>;

  if (!product) {
    return (
      <div className="container section empty-state">
        <div className="icon">🧪</div>
        <p>We couldn't find that product.</p>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}
          </div>
          <h1>{product.name}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container grid-2">
          <motion.div
            className="thumb"
            style={{ borderRadius: 18, overflow: 'hidden', background: 'var(--color-surface)' }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={product.image_url} alt={product.name} />
          </motion.div>

          <Reveal delay={0.1}>
            {product.categories && <span className="badge">{product.categories.name}</span>}
            <div className="price" style={{ fontSize: 30, marginBottom: 16 }}>
              ${Number(product.price).toFixed(2)}
            </div>
            <p>{product.description || product.short_desc}</p>

            <div className="qty-control" style={{ margin: '20px 0' }}>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>–</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary"
                onClick={() => {
                  addItem(product, quantity);
                  setAdded(true);
                }}
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-dark"
                onClick={() => {
                  addItem(product, quantity);
                  router.push(user ? '/checkout' : '/login');
                }}
              >
                {user ? 'Buy Now' : 'Log In to Buy'}
              </motion.button>
            </div>
            {added && <p className="helper-text" style={{ marginTop: 14 }}>Added to cart. <Link href="/cart">View cart</Link></p>}

            <p className="helper-text" style={{ marginTop: 24 }}>
              For laboratory research use only. Not for human or veterinary use.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
