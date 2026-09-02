'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { getSiteContent } from '@/lib/siteContent';
import ProductCard from '@/components/ProductCard.jsx';
import Reveal from '@/components/Reveal.jsx';
import Marquee from '@/components/Marquee.jsx';
import AnimatedCounter from '@/components/AnimatedCounter.jsx';
import TestimonialCarousel from '@/components/TestimonialCarousel.jsx';
import HeroVisual from '@/components/HeroVisual.jsx';

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const CATEGORY_META = [
  { slug: 'fat-loss', name: 'Fat Loss', icon: '🔥' },
  { slug: 'muscle-growth', name: 'Muscle Growth', icon: '💪' },
  { slug: 'recovery', name: 'Recovery', icon: '🩹' },
];

// Fallback content shown if the admin hasn't saved anything to site_content
// yet (or the request fails) — the homepage should never look broken.
const DEFAULT_CONTENT = {
  hero: {
    eyebrow: 'Research Peptides & Custom Synthesis',
    title: 'Peptides for Revitalization & Health',
    subtitle:
      'Drago Pharma supplies high-purity peptides synthesized for laboratory and investigational research, with bulk supply and custom synthesis available.',
    primary_cta_label: 'Shop Peptides',
    primary_cta_link: '/shop',
    secondary_cta_label: 'Request a Quote',
    secondary_cta_link: '/contact-us',
  },
  trust_badges: ['Third-Party Tested', 'Ships in 24h', 'USA Based Lab', '>99% Purity', 'Secure Checkout'],
  stats: [
    { label: 'Research Peptides', value: 40, suffix: '+' },
    { label: 'Countries Shipped', value: 25, suffix: '+' },
    { label: 'Orders Fulfilled', value: 12000, suffix: '+' },
    { label: 'Avg. Purity', value: 99, suffix: '%' },
  ],
  features: [
    { icon: '🧪', title: 'Third-Party Tested', text: 'Every batch is verified by an independent lab for purity and identity.' },
    { icon: '🚚', title: 'Fast, Discreet Shipping', text: 'Orders ship within 24 hours in unmarked, temperature-safe packaging.' },
    { icon: '🔒', title: 'Secure Checkout', text: 'Encrypted payments and privacy-first order handling, every time.' },
    { icon: '🧬', title: 'Custom Synthesis', text: 'Need a specific sequence or quantity? Our lab can synthesize to spec.' },
  ],
  testimonials: [],
  promo: { enabled: false, text: '', link_label: 'Shop Now', link: '/shop' },
  newsletter: { title: 'Stay in the loop', subtitle: 'Get restock alerts and research notes — no spam.' },
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('is_active', true)
      .limit(4)
      .then(({ data }) => {
        if (active) {
          setFeatured(data ?? []);
          setLoading(false);
        }
      });

    getSiteContent('home', DEFAULT_CONTENT).then((value) => {
      if (active && value) setContent({ ...DEFAULT_CONTENT, ...value });
    });

    return () => { active = false; };
  }, []);

  const { hero, trust_badges, stats, features, testimonials, promo, newsletter } = content;

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  return (
    <>
      <section className="hero">
        <motion.div
          className="hero-stripe"
          animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-orb hero-orb-a"
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-orb hero-orb-b"
          animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container">
          <div>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {hero.eyebrow}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              {hero.title}
            </motion.h1>
            <motion.p
              className="lead"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              className="cta-row"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link href={hero.primary_cta_link || '/shop'} className="btn btn-primary">
                  {hero.primary_cta_label}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={hero.secondary_cta_link || '/contact-us'}
                  className="btn btn-outline"
                  style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  {hero.secondary_cta_label}
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {trust_badges?.length > 0 && <Marquee items={trust_badges} />}

      {stats?.length > 0 && (
        <section className="section stats-section">
          <div className="container">
            <div className="stats-row">
              {stats.map((s, i) => (
                <Reveal as="div" className="stat" key={s.label} delay={i * 0.08}>
                  <AnimatedCounter value={Number(s.value) || 0} suffix={s.suffix || ''} />
                  <span className="stat-label">{s.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <Reveal as="div" className="section-head">
            <span className="eyebrow">Browse by category</span>
            <h2>Find the right research peptide</h2>
          </Reveal>
          <Reveal as="div" className="category-row" delay={0.1}>
            {CATEGORY_META.map((cat) => (
              <motion.div key={cat.slug} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                <Link href={`/shop?category=${cat.slug}`} className="chip">
                  {cat.icon} {cat.name}
                </Link>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <Reveal as="div" className="section-head">
            <span className="eyebrow">Featured</span>
            <h2>Popular Research Peptides</h2>
          </Reveal>
          {loading ? (
            <p className="text-center">Loading products…</p>
          ) : (
            <motion.div
              className="product-grid"
              variants={gridVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {featured.map((p) => (
                <motion.div key={p.id} variants={cardVariants}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
          <div className="text-center" style={{ marginTop: 36 }}>
            <Link href="/shop" className="btn btn-dark">View All Peptides</Link>
          </div>
        </div>
      </section>

      {features?.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal as="div" className="section-head">
              <span className="eyebrow">Why Drago Pharma</span>
              <h2>Built for serious researchers</h2>
            </Reveal>
            <div className="feature-grid">
              {features.map((f, i) => (
                <Reveal as="div" className="feature-card" key={f.title} delay={i * 0.08}>
                  <span className="feature-icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {promo?.enabled && promo?.text && (
        <section className="promo-banner">
          <div className="container promo-inner">
            <Reveal as="p" className="promo-text">{promo.text}</Reveal>
            <Reveal delay={0.1}>
              <Link href={promo.link || '/shop'} className="btn btn-white">
                {promo.link_label || 'Shop Now'}
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {testimonials?.length > 0 && (
        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <Reveal as="div" className="section-head">
              <span className="eyebrow">Trusted by researchers</span>
              <h2>What buyers are saying</h2>
            </Reveal>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <Reveal as="div" className="disclaimer">
            <h2>Laboratory Research Disclaimer</h2>
            <p>All products are intended strictly for research purposes and are not approved for human or veterinary use.</p>
            <Link href="/faq" className="btn btn-white">View Details</Link>
          </Reveal>
        </div>
      </section>

      {newsletter?.title && (
        <section className="section newsletter-section">
          <div className="container">
            <Reveal as="div" className="newsletter-box">
              <div>
                <h2>{newsletter.title}</h2>
                <p>{newsletter.subtitle}</p>
              </div>
              {subscribed ? (
                <p className="newsletter-thanks">Thanks — you're on the list! 🎉</p>
              ) : (
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn btn-primary"
                    type="submit"
                  >
                    Subscribe
                  </motion.button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
