'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from './CartDrawer.jsx';

const NAV_LINKS = [
  { href: '/', label: 'Home', end: true },
  { href: '/shop', label: 'Shop' },
  { href: '/about-us', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact-us', label: 'Contact' },
];

function isActive(pathname, href, end) {
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Header() {
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="announce-bar">
        All peptides are strictly for laboratory research use only — not for human consumption.
      </div>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">
            <img src="/images/logo.webp" alt="Drago Pharma" />
          </Link>

          <nav className="main-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(pathname, link.href, link.end) ? 'active' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            {isAdmin && (
              <button
                className="icon-btn admin-badge-btn"
                aria-label="Admin panel"
                onClick={() => router.push('/admin')}
                title="Admin panel"
              >
                ⚙️
              </button>
            )}
            <button
              className="icon-btn"
              aria-label={user ? 'Account' : 'Log in'}
              onClick={() => router.push(user ? '/account' : '/login')}
            >
              👤
            </button>
            <button className="icon-btn" aria-label="View cart" onClick={() => setCartOpen(true)}>
              🛒
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            <button
              className="icon-btn nav-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="container" style={{ paddingBottom: 16 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(pathname, link.href, link.end) ? 'active' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
