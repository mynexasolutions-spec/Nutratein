'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FlaskConical, 
  Truck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="modern-footer">
      {/* Top Value Propositions / Trust Strip */}
      <div className="footer-trust-strip">
        <div className="footer-container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon-box">
                <FlaskConical size={22} />
              </div>
              <div>
                <h4 className="trust-title">&ge;99% High Purity</h4>
                <p className="trust-sub">HPLC &amp; Mass Spec verified batch testing</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="trust-title">Third-Party Tested</h4>
                <p className="trust-sub">Independent USA certified laboratory analysis</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="trust-title">Temperature Controlled</h4>
                <p className="trust-sub">Cold-chain insulated express packaging</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Lock size={22} />
              </div>
              <div>
                <h4 className="trust-title">Secure Compliance</h4>
                <p className="trust-sub">256-Bit encrypted research transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="modern-footer-grid">
            {/* Brand Column */}
            <div className="footer-brand-col">
              <Link href="/" className="footer-brand" aria-label="Drago Pharma">
                <img 
                  src="/images/logo.webp" 
                  alt="Drago Pharma" 
                  className="footer-logo-img" 
                />
              </Link>
              <p className="footer-brand-desc">
                Pioneering bio-molecular peptide synthesis, lyophilized biochemicals, and precision analytical standards strictly for certified research institutions and laboratory investigations.
              </p>

              <div className="footer-contact-items">
                <div className="footer-contact-row">
                  <Mail size={16} className="footer-contact-icon" />
                  <a href="mailto:info@dragopharma.com">info@dragopharma.com</a>
                </div>
              </div>

              <div className="footer-status-pill">
                <span className="status-indicator"></span>
                <span>Laboratories Operating at Full Capacity</span>
              </div>
            </div>

            {/* Column 2: Research Peptides */}
            <div className="footer-col">
              <h4 className="footer-col-title">Research Categories</h4>
              <ul className="footer-links">
                <li><Link href="/shop">All Peptide Catalog</Link></li>
                <li><Link href="/shop?category=fat-loss">Metabolic &amp; Lipid Research</Link></li>
                <li><Link href="/shop?category=muscle-growth">Tissue &amp; Growth Factors</Link></li>
                <li><Link href="/shop?category=recovery">Cellular Recovery &amp; Repair</Link></li>
                <li><Link href="/shop">Lyophilized Solutions</Link></li>
              </ul>
            </div>

            {/* Column 3: Science & Lab */}
            <div className="footer-col">
              <h4 className="footer-col-title">Science &amp; Company</h4>
              <ul className="footer-links">
                <li><Link href="/about-us">About Drago Pharma</Link></li>
                <li><Link href="/faq">Research FAQ</Link></li>
                <li><Link href="/contact-us">Institutional Inquiry</Link></li>
                <li><Link href="/account">Research Portal</Link></li>
                <li><Link href="/faq">Quality Assurance</Link></li>
              </ul>
            </div>

            {/* Column 4: Newsletter / Compliance */}
            <div className="footer-col footer-newsletter-col">
              <h4 className="footer-col-title">Research Bulletins</h4>
              <p className="footer-col-text">
                Receive newly published batch purity reports, compound syntheses, and technical bulletins.
              </p>

              {subscribed ? (
                <div className="newsletter-success">
                  <CheckCircle2 size={18} />
                  <span>Thank you! You are subscribed to lab bulletins.</span>
                </div>
              ) : (
                <form className="modern-newsletter-form" onSubmit={handleSubscribe}>
                  <div className="newsletter-input-wrap">
                    <div className="footer-newsletter-icon" aria-hidden="true">
                      <Mail size={16} />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Enter research email..." 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="newsletter-input footer-newsletter-input"
                    />
                    <button type="submit" className="newsletter-submit-btn footer-newsletter-btn" aria-label="Subscribe">
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </form>
              )}

              <div className="footer-legal-links">
                <Link href="/faq">Terms of Supply</Link>
                <span className="dot-sep">&bull;</span>
                <Link href="/faq">Privacy Notice</Link>
                <span className="dot-sep">&bull;</span>
                <Link href="/faq">Refund Policy</Link>
              </div>
            </div>
          </div>


          {/* Bottom Bar */}
          <div className="modern-footer-bottom">
            <div className="copyright-text">
              &copy; {new Date().getFullYear()} Drago Pharma Biochemical Research Ltd. All rights reserved.
            </div>
            <div className="bottom-badges">
              <span className="secure-badge">
                <Lock size={13} /> SSL Encrypted Checkout
              </span>
              <span className="secure-badge">
                <CheckCircle2 size={13} /> ISO 9001 Compliant Synthesis
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
