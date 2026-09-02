'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  notes: '',
};

function CheckoutContent() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY_FORM, email: user?.email || '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <div className="icon">🛒</div>
        <h2>Your cart is empty</h2>
        <Link href="/shop" className="btn btn-primary">Shop Peptides</Link>
      </div>
    );
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const required = ['fullName', 'email', 'address1', 'city', 'state', 'postalCode', 'country'];
    if (required.some((f) => !form[f].trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id ?? null,
          email: form.email,
          full_name: form.fullName,
          phone: form.phone,
          total: subtotal,
          notes: form.notes,
          shipping_address: {
            address1: form.address1,
            address2: form.address2,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: form.country,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: Number((item.price * item.quantity).toFixed(2)),
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/cart">Cart</Link> / Checkout</div>
          <h1>Checkout</h1>
        </div>
      </div>

      <section className="section">
        <div className="container grid-2">
          <form className="form-card" onSubmit={handleSubmit}>
            <h3>Shipping details</h3>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Full name *</label>
                <input value={form.fullName} onChange={update('fullName')} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={update('email')} required />
              </div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={update('phone')} />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input value={form.address1} onChange={update('address1')} required />
            </div>
            <div className="form-group">
              <label>Apartment, suite, etc. (optional)</label>
              <input value={form.address2} onChange={update('address2')} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input value={form.city} onChange={update('city')} required />
              </div>
              <div className="form-group">
                <label>State / Province *</label>
                <input value={form.state} onChange={update('state')} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Postal code *</label>
                <input value={form.postalCode} onChange={update('postalCode')} required />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input value={form.country} onChange={update('country')} required />
              </div>
            </div>

            <div className="form-group">
              <label>Order notes (optional)</label>
              <textarea rows={3} value={form.notes} onChange={update('notes')} />
            </div>

            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Placing order…' : `Place Order — $${subtotal.toFixed(2)}`}
            </button>
            <p className="helper-text" style={{ marginTop: 14, marginBottom: 0 }}>
              Payment is arranged after order confirmation. No card details are collected on this page.
            </p>
          </form>

          <div className="form-card" style={{ alignSelf: 'flex-start' }}>
            <h3>Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)', margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
