'use client';

import { motion } from 'framer-motion';

export default function Marquee({ items = [] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className="marquee">
      <motion.div
        className="marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: Math.max(items.length * 3, 12), repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((item, i) => (
          <span className="marquee-item" key={i}>
            ✓ {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
