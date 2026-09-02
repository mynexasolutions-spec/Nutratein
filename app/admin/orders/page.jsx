'use client';

import { Fragment, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from('orders').update({ status }).eq('id', id);
  }

  return (
    <div>
      <h1>Orders</h1>
      <p className="helper-text" style={{ marginBottom: 24 }}>
        Update fulfillment status — customers see this in their account.
      </p>

      <div className="form-card">
        {loading ? (
          <p>Loading…</p>
        ) : orders.length === 0 ? (
          <p className="helper-text">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr>
                    <td>#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td>{o.full_name}<br /><span className="helper-text">{o.email}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>${Number(o.total).toFixed(2)}</td>
                    <td>
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      >
                        {expanded === o.id ? 'Hide' : 'Items'}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr>
                      <td colSpan={6}>
                        <div style={{ padding: '8px 0' }}>
                          {o.order_items?.map((item) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                              <span>{item.product_name} × {item.quantity}</span>
                              <span>${Number(item.line_total).toFixed(2)}</span>
                            </div>
                          ))}
                          {o.notes && <p className="helper-text" style={{ marginTop: 8 }}>Notes: {o.notes}</p>}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
