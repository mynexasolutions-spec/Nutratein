'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader.jsx';
import { 
  HelpCircle, 
  ChevronDown, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  FlaskConical,
  Truck,
  RotateCcw
} from 'lucide-react';

const FAQS = [
  {
    id: 'usage',
    category: 'Research & Usage',
    badge: 'Compliance',
    q: 'What are these peptides used for?',
    a: 'All peptides sold on this site are intended strictly for laboratory and investigational research use. They are not approved for human or veterinary use, and are not sold as drugs, supplements, or cosmetics.',
  },
  {
    id: 'purity',
    category: 'Purity & Quality',
    badge: 'Quality Control',
    q: 'How is purity verified?',
    a: 'Each batch is independently tested for purity using High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS). Certificates of Analysis (COA) are available upon request for research customers.',
  },
  {
    id: 'synthesis',
    category: 'Purity & Quality',
    badge: 'Custom Orders',
    q: 'Do you offer custom synthesis?',
    a: 'Yes. Reach out via our Contact page with your target sequence, quantity, and required timeline, and our scientific synthesis team will follow up promptly with a formal quote.',
  },
  {
    id: 'shipping',
    category: 'Orders & Shipping',
    badge: 'Logistics',
    q: 'What is your shipping policy?',
    a: 'Orders are processed immediately after confirmation and shipped via premium tracked courier with protective temperature packaging. Shipping rates and delivery windows are calculated at checkout based on destination.',
  },
  {
    id: 'returns',
    category: 'Orders & Shipping',
    badge: 'Returns',
    q: 'What is your refund policy?',
    a: 'Unopened products in their original manufacturer seal may be returned within 14 days of delivery. Contact our support team with your order number to initiate an authorized return.',
  },
];

const CATEGORIES = ['All', 'Research & Usage', 'Purity & Quality', 'Orders & Shipping'];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  // First item open by default
  const [openItems, setOpenItems] = useState({ usage: true });

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = activeCategory === 'All' 
    ? FAQS 
    : FAQS.filter((faq) => faq.category === activeCategory);

  return (
    <div className="faq-page-wrapper">
      {/* 1. UNIFIED PAGE HERO */}
      <PageHeader
        badge="FREQUENTLY ASKED QUESTIONS"
        badgeIcon={HelpCircle}
        title="Answers to Common"
        titleHighlight="Research Inquiries"
        subtitle="Transparent information regarding our compound purity standards, laboratory compliance, custom synthesis, and delivery protocols."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' }
        ]}
      />

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="faq-container">
        {/* Category Filter Pills */}
        <div className="faq-filter-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`faq-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Accordion */}
        <div className="faq-accordion-list">
          {filteredFaqs.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <div key={item.id} className={`faq-card ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-card-header"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                >
                  <div className="faq-question-wrap">
                    <span className="faq-badge">{item.badge}</span>
                    <span className="faq-question-text">{item.q}</span>
                  </div>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>

                {isOpen && (
                  <div className="faq-card-body">
                    <p className="faq-answer-text">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Laboratory Research Disclaimer */}
        <div className="faq-disclaimer-card">
          <div className="faq-disclaimer-icon">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3>Laboratory Research Disclaimer</h3>
            <p>
              All products listed and supplied by Drago Pharma are intended solely for in-vitro scientific research and investigational laboratory use. They are not approved by any regulatory body for human or veterinary use, and must not be used as pharmaceuticals, medical devices, dietary supplements, or cosmetics.
            </p>
          </div>
        </div>

        {/* Still Have Questions Box */}
        <div className="faq-support-card">
          <div className="faq-support-text">
            <h4>Still Have Questions?</h4>
            <p>Can&apos;t find the specific information you need? Connect directly with our laboratory and support specialists.</p>
          </div>
          <Link href="/contact-us" className="faq-support-btn">
            <span>Contact Support</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
