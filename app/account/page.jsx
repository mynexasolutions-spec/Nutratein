'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

function AccountContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>My Account</h1>
        </div>
      </div>

      <section className="section">
        <div className="container grid-2">
          <div>
            <h3>Order History</h3>
            {loading ? (
              <p>Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="helper-text">You haven't placed any orders yet.</p>
            ) : (
              orders.map((order) => (
                <div className="form-card" key={order.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong>Order #{order.id.slice(0, 8).toUpperCase()}</strong>
                    <span className="badge">{order.status}</span>
                  </div>
                  <p className="helper-text" style={{ marginBottom: 10 }}>
                    Placed {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  {order.order_items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span>{item.product_name} × {item.quantity}</span>
                      <span>${Number(item.line_total).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--color-border)', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Total</span>
                    <span>${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="form-card" style={{ alignSelf: 'flex-start' }}>
            <h3>Account Details</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <button className="btn btn-outline btn-block" onClick={handleSignOut}>Log Out</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Account() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}
