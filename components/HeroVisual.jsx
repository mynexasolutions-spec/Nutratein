'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const MINI_CARDS = [
  {
    icon: '🧪',
    label: 'Purity Verified',
    value: '>99%',
    className: 'hv-mini hv-mini-a',
    float: { y: [0, -14, 0], x: [0, 6, 0] },
    duration: 6,
  },
  {
    icon: '🚚',
    label: 'Ships In',
    value: '24h',
    className: 'hv-mini hv-mini-b',
    float: { y: [0, 12, 0], x: [0, -8, 0] },
    duration: 7,
  },
  {
    icon: '🔒',
    label: 'Secure',
    value: 'Checkout',
    className: 'hv-mini hv-mini-c',
    float: { y: [0, -10, 0], x: [0, -6, 0] },
    duration: 8,
  },
];

export default function HeroVisual({ image = '/images/fragment-1-300x300.webp' }) {
  const stageRef = useRef(null);

  // Raw pointer position within the stage, -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Smooth it out so the tilt feels fluid, not jumpy
  const springX = useSpring(px, { stiffness: 120, damping: 16, mass: 0.4 });
  const springY = useSpring(py, { stiffness: 120, damping: 16, mass: 0.4 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const shineX = useTransform(springX, [-0.5, 0.5], ['20%', '80%']);
  const shineY = useTransform(springY, [-0.5, 0.5], ['20%', '80%']);

  function handleMouseMove(e) {
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(x);
    py.set(y);
  }

  function handleMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      className="hero-visual"
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      {/* Main product card — tilts toward the cursor and gently bobs on its own */}
      <motion.div
        className="hv-main-card"
        style={{ rotateX, rotateY }}
        animate={{ y: [0, -10, 0] }}
        transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="hv-shine"
          style={{ background: useTransform([shineX, shineY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 55%)`) }}
        />
        <img src={image} alt="Featured research peptide" />
        <div className="hv-main-label">
          <span className="hv-dot" />
          In Stock · Lab Verified
        </div>
      </motion.div>

      {/* Small floating badge cards that drift independently, adding depth & motion */}
      {MINI_CARDS.map((card, i) => (
        <motion.div
          key={card.label}
          className={card.className}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            scale: 1,
            ...card.float,
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.3 + i * 0.15 },
            scale: { duration: 0.5, delay: 0.3 + i * 0.15 },
            y: { duration: card.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
            x: { duration: card.duration + 1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
          }}
          whileHover={{ scale: 1.08 }}
        >
          <span className="hv-mini-icon">{card.icon}</span>
          <div>
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
