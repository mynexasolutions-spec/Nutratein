'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('orders').select('*').eq('id', orderId).single().then(({ data }) => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) return <div className="container section"><p>Loading…</p></div>;

  return (
    <div className="container section text-center" style={{ maxWidth: 560 }}>
      <div className="icon" style={{ fontSize: 48 }}>✅</div>
      <h1>Thank you for your order</h1>
      <p>
        {order
          ? <>A confirmation has been sent to <strong>{order.email}</strong>. Your order reference is <strong>{order.id.slice(0, 8).toUpperCase()}</strong>.</>
          : 'Your order has been placed.'}
      </p>
      <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );
}
