import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const collections = [
  {
    title: 'The Winter Edit',
    subtitle: 'Minimalist outerwear.',
    col: 'span 2',
    row: 'span 2',
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=900&auto=format&fit=crop',
    dark: true,
  },
  {
    title: 'Essential Knits',
    subtitle: 'Cashmere & Merino',
    col: 'span 1',
    row: 'span 1',
    image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=600&auto=format&fit=crop',
    dark: false,
  },
  {
    title: 'Accessories',
    subtitle: 'Refined details.',
    col: 'span 1',
    row: 'span 1',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    dark: true,
  },
  {
    title: 'The Silk Collection',
    subtitle: 'Fluid silhouettes for every occasion.',
    col: 'span 2',
    row: 'span 1',
    image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=900&auto=format&fit=crop',
    dark: false,
  },
];

const BentoGrid = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: '280px',
      gap: 16,
    }}>
      {collections.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: i * 0.1 }}
          whileHover={{ scale: 0.985 }}
          style={{
            gridColumn: item.col,
            gridRow: item.row,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* Background Image */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: item.dark
              ? 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
            transition: 'background 0.4s',
          }} />
          {/* Text */}
          <div style={{ position: 'absolute', bottom: 28, left: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.title}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>{item.subtitle}</p>
          </div>
          {/* Link overlay */}
          <Link to="/catalog" style={{ position: 'absolute', inset: 0 }} aria-label={item.title} />
        </motion.div>
      ))}

      <style>{`
        @media (max-width: 768px) {
          div[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BentoGrid;
