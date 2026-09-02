'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Reveal from '@/components/Reveal.jsx';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <div className="icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Browse our research peptides and add something to get started.</p>
        <Link href="/shop" className="btn btn-primary">Shop Peptides</Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Cart</div>
          <h1>Your Cart</h1>
        </div>
      </div>

      <section className="section">
        <div className="container grid-2">
          <div>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  className="cart-line"
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.25 }}
                >
                  <img src={item.image_url} alt={item.name} />
                  <div className="info">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{item.name}</strong>
                      <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                    <div className="price">${item.price.toFixed(2)}</div>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>–</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Reveal as="div" className="form-card" style={{ alignSelf: 'flex-start' }}>
            <h3>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: 'var(--color-ink-soft)', fontSize: 13.5 }}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href={user ? '/checkout' : '/login'}
              className="btn btn-primary btn-block"
            >
              {user ? 'Proceed to Checkout' : 'Log In to Checkout'}
            </Link>
            {!user && (
              <p className="helper-text" style={{ marginTop: 10, marginBottom: 0 }}>
                You'll need an account to check out. <Link href="/signup">Create one</Link> — it's quick.
              </p>
            )}
            <Link href="/shop" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>Continue Shopping</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
