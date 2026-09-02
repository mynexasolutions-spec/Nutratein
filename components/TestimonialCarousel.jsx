'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function TestimonialCarousel({ testimonials = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (!testimonials.length) return null;
  const current = testimonials[index];

  return (
    <div className="testimonial-carousel">
      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="testimonial"
        >
          <blockquote>“{current.quote}”</blockquote>
          <figcaption>
            <strong>{current.author}</strong>
            {current.role && <span> · {current.role}</span>}
          </figcaption>
        </motion.figure>
      </AnimatePresence>
      {testimonials.length > 1 && (
        <div className="testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Show testimonial ${i + 1}`}
              className={i === index ? 'dot active' : 'dot'}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
