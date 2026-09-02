'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ count: productCount }, { data: orders }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
      ]);

      const allOrders = orders ?? [];
      const revenue = allOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const pending = allOrders.filter((o) => o.status === 'pending').length;

      setStats({ products: productCount ?? 0, orders: allOrders.length, pending, revenue });
      setRecentOrders(allOrders.slice(0, 6));
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="helper-text" style={{ marginBottom: 24 }}>
        Full control panel — manage the homepage, catalog and orders from here.
      </p>

      <div className="admin-stat-grid">
        <div className="form-card admin-stat-card">
          <span className="helper-text">Products</span>
          <strong>{loading ? '—' : stats.products}</strong>
        </div>
        <div className="form-card admin-stat-card">
          <span className="helper-text">Orders (recent)</span>
          <strong>{loading ? '—' : stats.orders}</strong>
        </div>
        <div className="form-card admin-stat-card">
          <span className="helper-text">Pending Orders</span>
          <strong>{loading ? '—' : stats.pending}</strong>
        </div>
        <div className="form-card admin-stat-card">
          <span className="helper-text">Revenue (recent)</span>
          <strong>{loading ? '—' : `$${stats.revenue.toFixed(2)}`}</strong>
        </div>
      </div>

      <div className="form-card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
          <Link href="/admin/orders" className="btn btn-outline btn-sm">View all</Link>
        </div>
        {loading ? (
          <p>Loading…</p>
        ) : recentOrders.length === 0 ? (
          <p className="helper-text">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td>{o.full_name}</td>
                  <td><span className="badge">{o.status}</span></td>
                  <td>${Number(o.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
