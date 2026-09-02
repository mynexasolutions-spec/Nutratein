'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    const { error: err } = await supabase
      .from('categories')
      .insert({ name, slug: slugify(name), description });
    if (err) { setError(err.message); return; }
    setName('');
    setDescription('');
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category? Products in it will become uncategorized.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <h1>Categories</h1>
      <p className="helper-text" style={{ marginBottom: 24 }}>
        Categories power the shop filters and the homepage "Browse by category" chips.
      </p>

      <form className="form-card" onSubmit={handleAdd} style={{ marginBottom: 32 }}>
        <h3 style={{ marginTop: 0 }}>New Category</h3>
        {error && <p style={{ color: 'var(--color-brand)' }}>{error}</p>}
        <div className="admin-form-grid">
          <label>
            Name
            <input required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Description
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
        </div>
        <button className="btn btn-primary" type="submit">Add Category</button>
      </form>

      <div className="form-card">
        <h3>All Categories</h3>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th></th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{c.description}</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => handleDelete(c.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
