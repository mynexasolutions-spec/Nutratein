'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const BLANK = {
  id: null,
  name: '',
  slug: '',
  short_desc: '',
  description: '',
  price: '',
  compare_price: '',
  image_url: '',
  category_id: '',
  stock: 0,
  sku: '',
  featured: false,
  is_active: true,
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function loadAll() {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);
    setProducts(prods ?? []);
    setCategories(cats ?? []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  function startEdit(p) {
    setForm({ ...BLANK, ...p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startNew() {
    setForm(BLANK);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      short_desc: form.short_desc,
      description: form.description,
      price: Number(form.price) || 0,
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      image_url: form.image_url,
      category_id: form.category_id || null,
      stock: Number(form.stock) || 0,
      sku: form.sku,
      featured: !!form.featured,
      is_active: !!form.is_active,
    };

    const query = form.id
      ? supabase.from('products').update(payload).eq('id', form.id)
      : supabase.from('products').insert(payload);

    const { error: err } = await query;
    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }
    setForm(BLANK);
    loadAll();
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed.');
      }

      setForm((f) => ({ ...f, image_url: data.url }));
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
    loadAll();
  }

  return (
    <div>
      <h1>Products</h1>
      <p className="helper-text" style={{ marginBottom: 24 }}>
        Add, edit, feature or remove peptides. Changes appear on the shop instantly.
      </p>

      <form className="form-card" onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{form.id ? 'Edit Product' : 'New Product'}</h3>
          {form.id && (
            <button type="button" className="btn btn-outline btn-sm" onClick={startNew}>
              + New instead
            </button>
          )}
        </div>

        {error && <p style={{ color: 'var(--color-brand)' }}>{error}</p>}

        <div className="admin-form-grid">
          <label>
            Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Slug (auto if blank)
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.name)} />
          </label>
          <label>
            Price ($)
            <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>
          <label>
            Compare-at price ($)
            <input type="number" step="0.01" value={form.compare_price ?? ''} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} />
          </label>
          <label>
            Category
            <select value={form.category_id ?? ''} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Stock
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </label>
          <label>
            SKU
            <input value={form.sku ?? ''} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </label>
        </div>

        <label>
          Product image
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Product preview"
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border, #ddd)' }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <span className="helper-text">Uploading to Cloudinary…</span>}
              {uploadError && <span style={{ color: 'var(--color-brand)' }}>{uploadError}</span>}
            </div>
          </div>
        </label>
        <label>
          Image URL (auto-filled after upload, or paste one manually)
          <input value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/images/example.webp" />
        </label>

        <label>
          Short description
          <input value={form.short_desc ?? ''} onChange={(e) => setForm({ ...form, short_desc: e.target.value })} />
        </label>
        <label>
          Full description
          <textarea rows={4} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <div style={{ display: 'flex', gap: 24, margin: '12px 0' }}>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured on homepage
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active / visible in shop
          </label>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Create Product'}
        </button>
      </form>

      <div className="form-card">
        <h3>All Products ({products.length})</h3>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}{p.featured && <span className="badge" style={{ marginLeft: 6 }}>Featured</span>}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.is_active ? 'Active' : 'Hidden'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
