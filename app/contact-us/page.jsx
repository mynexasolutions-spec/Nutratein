'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader.jsx';
import { 
  Mail, 
  User, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  FlaskConical,
  MessageSquare
} from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    subject: 'General Inquiry',
    message: '' 
  });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@dragopharma.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. UNIFIED PAGE HERO */}
      <PageHeader
        badge="GET IN TOUCH"
        badgeIcon={Mail}
        title="Connect With Our"
        titleHighlight="Research Specialists"
        subtitle="Inquiries regarding compound purity, bulk orders, or custom synthesis quotes are handled promptly by our laboratory team."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' }
        ]}
      />

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="contact-container">
        <div className="contact-grid">
          {/* Left: Contact Form Card */}
          <div className="contact-form-card">
            <div className="contact-form-header">
              <h2>Send an Inquiry</h2>
              <p>Fill in your project details and our team will get back to you shortly.</p>
            </div>

            {sent && (
              <div className="contact-success-banner">
                <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4>Message Sent Successfully</h4>
                  <p>Thanks for reaching out! Our research and logistics team will review your message and reply shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="contact-input-group">
                <label className="contact-label">Full Name</label>
                <div className="contact-input-wrap">
                  <span className="contact-input-icon">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="Dr. Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="contact-input-group">
                <label className="contact-label">Email Address</label>
                <div className="contact-input-wrap">
                  <span className="contact-input-icon">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    className="contact-input"
                    placeholder="researcher@institution.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="contact-input-group">
                <label className="contact-label">Inquiry Subject</label>
                <div className="contact-input-wrap">
                  <span className="contact-input-icon">
                    <FlaskConical size={16} />
                  </span>
                  <select
                    className="contact-select"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Research Inquiry</option>
                    <option value="Custom Synthesis Quote">Custom Peptide Synthesis Quote</option>
                    <option value="Bulk Supply Order">Bulk Supply &amp; Volume Pricing</option>
                    <option value="COA & Purity Request">Certificate of Analysis / Quality Control</option>
                    <option value="Shipping & Logistics">Shipping &amp; Logistics Question</option>
                  </select>
                </div>
              </div>

              <div className="contact-input-group">
                <label className="contact-label">Message Details</label>
                <textarea
                  className="contact-textarea"
                  rows={5}
                  placeholder="Please describe your requirements, peptide sequence, or questions..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                <span>Send Message</span>
                <Send size={15} />
              </button>
            </form>
          </div>

          {/* Right: Direct Information & Synthesis Guidelines */}
          <div className="contact-info-col">
            <div className="contact-info-card">
              <div className="contact-info-item">
                <div className="contact-info-icon-box">
                  <Mail size={18} />
                </div>
                <div className="contact-info-content">
                  <div className="contact-info-label">Direct Email</div>
                  <div className="contact-info-val">info@dragopharma.com</div>
                  <p className="contact-info-sub">Monitored directly by our scientific support team.</p>
                  <button 
                    type="button" 
                    className="contact-copy-btn"
                    onClick={handleCopyEmail}
                  >
                    {copied ? (
                      <>
                        <Check size={12} style={{ color: '#16a34a' }} />
                        <span style={{ color: '#16a34a' }}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon-box">
                  <Clock size={18} />
                </div>
                <div className="contact-info-content">
                  <div className="contact-info-label">Operating Hours</div>
                  <div className="contact-info-val">Monday – Friday, 9am – 5pm</div>
                  <p className="contact-info-sub">EST timezone. Typical reply time is within 2–4 hours.</p>
                </div>
              </div>
            </div>

            {/* Custom Synthesis & Bulk Supply Callout */}
            <div className="contact-quote-card">
              <span className="contact-quote-badge">
                <Sparkles size={12} />
                <span>Custom Synthesis &amp; Bulk</span>
              </span>
              <h3>Quote Request Guidelines</h3>
              <p>
                For quote requests on bulk supply or custom peptide synthesis, please make sure your message includes:
              </p>
              <ul className="contact-quote-list">
                <li>
                  <span className="contact-quote-dot"></span>
                  <span>Target peptide name or amino acid sequence</span>
                </li>
                <li>
                  <span className="contact-quote-dot"></span>
                  <span>Required quantity (mg, grams, or bulk kilograms)</span>
                </li>
                <li>
                  <span className="contact-quote-dot"></span>
                  <span>Purity grade specification (&ge;95% or &ge;98%)</span>
                </li>
                <li>
                  <span className="contact-quote-dot"></span>
                  <span>Target delivery timeline &amp; shipping destination</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
