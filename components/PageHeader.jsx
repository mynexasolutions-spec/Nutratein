'use client';

import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function PageHeader({
  badge,
  badgeIcon: BadgeIcon = Sparkles,
  title,
  titleHighlight,
  subtitle,
  breadcrumb = [],
}) {
  return (
    <section className="page-hero-unified">
      <div className="page-hero-glow"></div>
      <div className="page-hero-container">
        {/* Breadcrumb row */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="page-hero-breadcrumb" aria-label="Breadcrumb">
            {breadcrumb.map((crumb, idx) => {
              const isLast = idx === breadcrumb.length - 1;
              return (
                <span key={idx} className="page-hero-crumb-item">
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="page-hero-crumb-link">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="page-hero-crumb-current">{crumb.label}</span>
                  )}
                  {!isLast && <ChevronRight size={13} className="page-hero-crumb-sep" />}
                </span>
              );
            })}
          </nav>
        )}

        {/* Eyebrow Badge */}
        {badge && (
          <div className="page-hero-eyebrow">
            <span className="page-hero-eyebrow-icon">
              <BadgeIcon size={14} />
            </span>
            <span>{badge}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="page-hero-title">
          {title} {titleHighlight && <span className="page-hero-highlight">{titleHighlight}</span>}
        </h1>

        {/* Subtitle */}
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
