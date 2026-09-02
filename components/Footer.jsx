import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="/images/logo.webp" alt="Drago Pharma" style={{ height: 34, marginBottom: 14, filter: 'brightness(0) invert(1)' }} />
            <p style={{ color: '#aeb2b7', maxWidth: 320 }}>
              Precision peptide synthesis and supply for laboratory and investigational research.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop">All Peptides</Link></li>
              <li><Link href="/shop?category=fat-loss">Fat Loss</Link></li>
              <li><Link href="/shop?category=muscle-growth">Muscle Growth</Link></li>
              <li><Link href="/shop?category=recovery">Recovery</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact-us">Contact</Link></li>
              <li><Link href="/account">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/faq">Terms &amp; Conditions</Link></li>
              <li><Link href="/faq">Privacy Policy</Link></li>
              <li><Link href="/faq">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Drago Pharma. For research use only. Not for human or veterinary use.</span>
          <span>info@dragopharma.com</span>
        </div>
      </div>
    </footer>
  );
}
