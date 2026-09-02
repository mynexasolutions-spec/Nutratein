'use client';

import { useEffect, useState } from 'react';
import { getSiteContent, saveSiteContent } from '@/lib/siteContent';

const DEFAULT_CONTENT = {
  hero: {
    eyebrow: '',
    title: '',
    subtitle: '',
    primary_cta_label: 'Shop Peptides',
    primary_cta_link: '/shop',
    secondary_cta_label: 'Request a Quote',
    secondary_cta_link: '/contact-us',
  },
  trust_badges: [],
  stats: [],
  features: [],
  testimonials: [],
  promo: { enabled: false, text: '', link_label: 'Shop Now', link: '/shop' },
  newsletter: { title: '', subtitle: '' },
};

export default function AdminHomepage() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    getSiteContent('home', DEFAULT_CONTENT).then((value) => {
      setContent({ ...DEFAULT_CONTENT, ...value });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    const { error } = await saveSiteContent('home', content);
    setSaving(false);
    if (!error) setSavedAt(new Date());
  }

  function updateHero(field, val) {
    setContent((c) => ({ ...c, hero: { ...c.hero, [field]: val } }));
  }
  function updatePromo(field, val) {
    setContent((c) => ({ ...c, promo: { ...c.promo, [field]: val } }));
  }
  function updateNewsletter(field, val) {
    setContent((c) => ({ ...c, newsletter: { ...c.newsletter, [field]: val } }));
  }

  // --- list helpers (badges, stats, features, testimonials) ---
  function updateListItem(key, index, patch) {
    setContent((c) => {
      const list = [...c[key]];
      list[index] = typeof patch === 'object' ? { ...list[index], ...patch } : patch;
      return { ...c, [key]: list };
    });
  }
  function addListItem(key, blank) {
    setContent((c) => ({ ...c, [key]: [...c[key], blank] }));
  }
  function removeListItem(key, index) {
    setContent((c) => ({ ...c, [key]: c[key].filter((_, i) => i !== index) }));
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Homepage Content</h1>
          <p className="helper-text">Everything here is live on the homepage the moment you save.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
      {savedAt && <p className="helper-text" style={{ color: '#1a7f37' }}>Saved at {savedAt.toLocaleTimeString()}</p>}

      {/* HERO */}
      <div className="form-card">
        <h3>Hero Banner</h3>
        <label>Eyebrow text<input value={content.hero.eyebrow} onChange={(e) => updateHero('eyebrow', e.target.value)} /></label>
        <label>Headline<input value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)} /></label>
        <label>Subtitle<textarea rows={3} value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} /></label>
        <div className="admin-form-grid">
          <label>Primary button label<input value={content.hero.primary_cta_label} onChange={(e) => updateHero('primary_cta_label', e.target.value)} /></label>
          <label>Primary button link<input value={content.hero.primary_cta_link} onChange={(e) => updateHero('primary_cta_link', e.target.value)} /></label>
          <label>Secondary button label<input value={content.hero.secondary_cta_label} onChange={(e) => updateHero('secondary_cta_label', e.target.value)} /></label>
          <label>Secondary button link<input value={content.hero.secondary_cta_link} onChange={(e) => updateHero('secondary_cta_link', e.target.value)} /></label>
        </div>
      </div>

      {/* PROMO BANNER */}
      <div className="form-card">
        <h3>Promo Banner</h3>
        <label className="checkbox-label">
          <input type="checkbox" checked={content.promo.enabled} onChange={(e) => updatePromo('enabled', e.target.checked)} />
          Show promo banner
        </label>
        <label>Text<input value={content.promo.text} onChange={(e) => updatePromo('text', e.target.value)} placeholder="Free shipping on orders over $150" /></label>
        <div className="admin-form-grid">
          <label>Button label<input value={content.promo.link_label} onChange={(e) => updatePromo('link_label', e.target.value)} /></label>
          <label>Button link<input value={content.promo.link} onChange={(e) => updatePromo('link', e.target.value)} /></label>
        </div>
      </div>

      {/* TRUST BADGES */}
      <div className="form-card">
        <h3>Trust Badge Strip</h3>
        {content.trust_badges.map((badge, i) => (
          <div key={i} className="admin-list-row">
            <input value={badge} onChange={(e) => updateListItem('trust_badges', i, e.target.value)} />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => removeListItem('trust_badges', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={() => addListItem('trust_badges', 'New badge')}>+ Add badge</button>
      </div>

      {/* STATS */}
      <div className="form-card">
        <h3>Stats Counters</h3>
        {content.stats.map((s, i) => (
          <div key={i} className="admin-list-row admin-list-row-3">
            <input placeholder="Label" value={s.label} onChange={(e) => updateListItem('stats', i, { label: e.target.value })} />
            <input placeholder="Value" type="number" value={s.value} onChange={(e) => updateListItem('stats', i, { value: e.target.value })} />
            <input placeholder="Suffix (+, %)" value={s.suffix} onChange={(e) => updateListItem('stats', i, { suffix: e.target.value })} />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => removeListItem('stats', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={() => addListItem('stats', { label: 'New stat', value: 0, suffix: '' })}>+ Add stat</button>
      </div>

      {/* FEATURES */}
      <div className="form-card">
        <h3>"Why Us" Feature Grid</h3>
        {content.features.map((f, i) => (
          <div key={i} className="admin-feature-row">
            <input placeholder="Emoji" style={{ width: 60 }} value={f.icon} onChange={(e) => updateListItem('features', i, { icon: e.target.value })} />
            <input placeholder="Title" value={f.title} onChange={(e) => updateListItem('features', i, { title: e.target.value })} />
            <input placeholder="Description" value={f.text} onChange={(e) => updateListItem('features', i, { text: e.target.value })} />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => removeListItem('features', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={() => addListItem('features', { icon: '✨', title: '', text: '' })}>+ Add feature</button>
      </div>

      {/* TESTIMONIALS */}
      <div className="form-card">
        <h3>Testimonials</h3>
        {content.testimonials.map((t, i) => (
          <div key={i} className="form-card" style={{ background: 'var(--color-surface)' }}>
            <label>Quote<textarea rows={2} value={t.quote} onChange={(e) => updateListItem('testimonials', i, { quote: e.target.value })} /></label>
            <div className="admin-form-grid">
              <label>Author<input value={t.author} onChange={(e) => updateListItem('testimonials', i, { author: e.target.value })} /></label>
              <label>Role<input value={t.role} onChange={(e) => updateListItem('testimonials', i, { role: e.target.value })} /></label>
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => removeListItem('testimonials', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={() => addListItem('testimonials', { quote: '', author: '', role: '' })}>+ Add testimonial</button>
      </div>

      {/* NEWSLETTER */}
      <div className="form-card">
        <h3>Newsletter Block</h3>
        <label>Title<input value={content.newsletter.title} onChange={(e) => updateNewsletter('title', e.target.value)} /></label>
        <label>Subtitle<input value={content.newsletter.subtitle} onChange={(e) => updateNewsletter('subtitle', e.target.value)} /></label>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}
