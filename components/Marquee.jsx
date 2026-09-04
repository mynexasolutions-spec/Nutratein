'use client';

import React from 'react';

// Crisp SVG Icons mapped to peptide/lab trust badge concepts
function FlaskIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.31L4.15 19.4A2 2 0 0 0 5.86 22h12.28a2 2 0 0 0 1.71-2.6L14 9.31V2" />
      <path d="M8.5 2h7" />
      <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="14" height="12" rx="2" />
      <path d="M15 8h4.5a2 2 0 0 1 1.6.8l2.4 3.2c.3.4.5.9.5 1.4V16a2 2 0 0 1-2 2h-1" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="17" cy="18" r="2.5" />
      <path d="M1 9h3" />
      <path d="M1 12h2" />
    </svg>
  );
}

function UsaLabIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 10h1" />
      <path d="M9 14h1" />
      <path d="M9 18h1" />
      <path d="M14 10h1" />
      <path d="M14 14h1" />
      <path d="M14 18h1" />
    </svg>
  );
}

function PurityIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 4.8L5.3 9.7l3.8 3.5-.9 5.2 4.8-2.6 4.8 2.6-.9-5.2 3.8-3.5-4.8-1.9L12 3z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16.5 9.4 4.5-2.8L12 2 3 6.6l4.5 2.8" />
      <path d="M12 22V12" />
      <path d="M21 7.6v8.8a2 2 0 0 1-1 1.7l-7 4.1a2 2 0 0 1-2 0l-7-4.1a2 2 0 0 1-1-1.7V7.6" />
      <path d="M3.3 7 12 12l8.7-5" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function DefaultCheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function renderBadgeIcon(badgeText) {
  const lower = badgeText.toLowerCase();

  if (lower.includes('test') || lower.includes('coa') || lower.includes('hplc') || lower.includes('lab') && !lower.includes('usa')) {
    return <FlaskIcon />;
  }
  if (lower.includes('ship') || lower.includes('24h') || lower.includes('fast') || lower.includes('dispatch') || lower.includes('deliver')) {
    return <TruckIcon />;
  }
  if (lower.includes('usa') || lower.includes('domestic') || lower.includes('american') || lower.includes('facility')) {
    return <UsaLabIcon />;
  }
  if (lower.includes('purity') || lower.includes('99%') || lower.includes('pure') || lower.includes('grade') || lower.includes('quality')) {
    return <PurityIcon />;
  }
  if (lower.includes('order') || lower.includes('fulfilled') || lower.includes('customer') || lower.includes('trusted') || lower.includes('10,000')) {
    return <OrderIcon />;
  }
  if (lower.includes('secure') || lower.includes('checkout') || lower.includes('safe') || lower.includes('ssl') || lower.includes('protect')) {
    return <ShieldCheckIcon />;
  }

  return <DefaultCheckIcon />;
}

export default function Marquee({ items = [], speed = 35 }) {
  if (!items || !items.length) return null;

  // Clean badges: strip raw Unicode checkmarks if present to display modern SVG icons
  const cleanBadges = items.map((item) => {
    if (typeof item === 'string') {
      return item.replace(/^[✓✔\s*•\->]+/, '').trim();
    }
    return item?.text || String(item);
  });

  // Duplicate items 4 times to guarantee a seamless, zero-gap infinite scroll on all screen sizes
  const loopBadges = [...cleanBadges, ...cleanBadges, ...cleanBadges, ...cleanBadges];

  return (
    <div
      className="marquee marquee-modern"
      aria-label="Trust Badges"
      style={{ '--marquee-duration': `${Math.max(cleanBadges.length * 5, speed)}s` }}
    >
      <div className="marquee-glow-line" aria-hidden="true" />
      <div className="marquee-track">
        {loopBadges.map((badge, index) => (
          <React.Fragment key={index}>
            <div className="marquee-item marquee-pill">
              <span className="marquee-icon-box" aria-hidden="true">
                {renderBadgeIcon(badge)}
              </span>
              <span className="marquee-text">{badge}</span>
            </div>
            <span className="marquee-divider" aria-hidden="true">
              ✦
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
