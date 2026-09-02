'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard.jsx';

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function Shop() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  function setSearchParams(params) {
    const qs = new URLSearchParams(params).toString();
    router.push(qs ? `/shop?${qs}` : '/shop');
  }

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      setCategories(data ?? []);
    });
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    async function load() {
      let q = supabase.from('products').select('*, categories(slug,name)').eq('is_active', true);

      if (activeCategory !== 'all') {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', activeCategory)
          .single();
        if (cat) q = q.eq('category_id', cat.id);
      }

      const { data } = await q.order('name');
      if (active) {
        setProducts(data ?? []);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [activeCategory]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">Home / Shop</div>
          <h1>Research Peptides</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="category-row" style={{ marginBottom: 0, justifyContent: 'flex-start' }}>
              <button
                className={`chip ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSearchParams({})}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`chip ${activeCategory === c.slug ? 'active' : ''}`}
                  onClick={() => setSearchParams({ category: c.slug })}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="Search peptides…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ maxWidth: 240 }}
            />
          </div>

          {loading ? (
            <p className="text-center">Loading products…</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔎</div>
              <p>No products match your search.</p>
            </div>
          ) : (
            <motion.div
              className="product-grid"
              variants={gridVariants}
              initial="hidden"
              animate="show"
              key={activeCategory + query}
            >
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.div key={p.id} variants={cardVariants} exit="exit" layout>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
