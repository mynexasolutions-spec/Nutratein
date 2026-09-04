'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function TestimonialCarousel({ testimonials = [] }) {
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const length = testimonials?.length || 0;

  // Responsive itemsPerView
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1080) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, length - itemsPerView);

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [itemsPerView, maxIndex, index]);

  const nextSlide = () => {
    if (length <= itemsPerView) return;
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (length <= itemsPerView) return;
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    if (length <= itemsPerView || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [length, itemsPerView, isPaused, maxIndex]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!length) return null;

  const getInitials = (name) => {
    if (!name) return 'VB';
    const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '');
    const parts = clean.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const showControls = length > itemsPerView;
  const totalDots = length <= itemsPerView ? 1 : maxIndex + 1;

  return (
    <div
      className="modern-testimonial-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="testimonial-slider-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="testimonial-slider-track"
          animate={{
            x: `-${index * (100 / itemsPerView)}%`,
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="testimonial-slide-item"
              style={{ flex: `0 0 ${100 / itemsPerView}%`, maxWidth: `${100 / itemsPerView}%` }}
            >
              <div className="modern-testimonial-card">
                {/* Decorative Watermark Quote */}
                <div className="testimonial-quote-watermark" aria-hidden="true">
                  <svg width="60" height="48" viewBox="0 0 84 68" fill="none">
                    <path
                      d="M0 68V37.74C0 14.96 15.64 0 35.36 0L38.76 10.88C24.48 12.92 18.36 21.08 17.68 31.28H37.4V68H0ZM46.24 68V37.74C46.24 14.96 61.88 0 81.6 0L85 10.88C70.72 12.92 64.6 21.08 63.92 31.28H83.64V68H46.24Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* Top Stars & Badge */}
                <div className="testimonial-card-header">
                  <div className="testimonial-stars" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, s) => (
                      <svg
                        key={s}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#e5a919"
                        stroke="#e5a919"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    <span className="testimonial-rating-score">5.0</span>
                  </div>

                  <div className="testimonial-verified-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Verified</span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <blockquote className="testimonial-quote-text">
                  “{item.quote}”
                </blockquote>

                {/* Author Footer */}
                <div className="testimonial-card-footer">
                  <div className="testimonial-author-avatar">
                    <span>{getInitials(item.author)}</span>
                  </div>
                  <div className="testimonial-author-details">
                    <div className="testimonial-author-name-row">
                      <strong className="testimonial-author-name">{item.author}</strong>
                      <span className="testimonial-check-icon" title="Verified Buyer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="testimonial-author-role">
                      <span>{item.role || 'Verified Buyer'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Controls (Arrows & Pagination) */}
      {showControls && (
        <div className="modern-testimonial-controls">
          <button
            type="button"
            className="testimonial-arrow-btn prev"
            onClick={prevSlide}
            aria-label="Previous testimonials"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="testimonial-pagination-dots">
            {[...Array(totalDots)].map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                className={`testimonial-dot-pill ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
              >
                <span className="sr-only">Slide {i + 1}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="testimonial-arrow-btn next"
            onClick={nextSlide}
            aria-label="Next testimonials"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}

      {/* Trust Highlights Strip below Testimonials */}
      <div className="testimonials-trust-strip">
        <div className="trust-strip-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span><strong>4.9 / 5</strong> Average Rating</span>
        </div>
        <div className="trust-strip-divider">•</div>
        <div className="trust-strip-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span><strong>100%</strong> Authenticated Reviews</span>
        </div>
        <div className="trust-strip-divider">•</div>
        <div className="trust-strip-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span><strong>HPLC & COA</strong> Verified Batches</span>
        </div>
      </div>
    </div>
  );
}
