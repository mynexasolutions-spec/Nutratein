'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartDrawer({ onClose }) {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();

  return (
    <AnimatePresence>
      <motion.div
        className="cart-drawer-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="cart-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      >
        <div className="cart-drawer-head">
          <h3 style={{ margin: 0 }}>Your Cart ({items.length})</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🧪</div>
              <p>Your cart is empty.</p>
              <Link href="/shop" onClick={onClose} className="btn btn-primary">
                Browse the shop
              </Link>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  className="cart-line"
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={item.image_url} alt={item.name} />
                  <div className="info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <strong style={{ fontSize: 14 }}>{item.name}</strong>
                      <button
                        className="icon-btn"
                        style={{ width: 26, height: 26 }}
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="price" style={{ fontSize: 15 }}>${item.price.toFixed(2)}</div>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>–</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-foot">
            <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span>Subtotal</span>
              <motion.span
                className="price"
                key={subtotal}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                ${subtotal.toFixed(2)}
              </motion.span>
            </div>
            <Link href="/cart" onClick={onClose} className="btn btn-outline btn-block" style={{ marginBottom: 10 }}>
              View Cart
            </Link>
            <Link
              href={user ? '/checkout' : '/login'}
              onClick={onClose}
              className="btn btn-primary btn-block"
            >
              {user ? 'Checkout' : 'Log In to Checkout'}
            </Link>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
