import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BentoGrid from '../components/BentoGrid';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

const Home = () => {
  const [subscribed, setSubscribed] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* ── Hero ────────────────────────────────── */}
      <section style={{
        width: '100%', maxWidth: 1280, margin: '0 auto',
        padding: '100px 24px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        <motion.p {...fadeUp(0)} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 24 }}>
          New Season · 2026
        </motion.p>

        <motion.h1 {...fadeUp(0.1)} style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#0f172a', maxWidth: 900, marginBottom: 28 }}>
          Where Minimalism Meets{' '}
          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 700 }}>Premium Craft</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} style={{ fontSize: 18, color: '#64748b', maxWidth: 580, lineHeight: 1.7, marginBottom: 48 }}>
          Curated collections for the contemporary minimalist. Precision crafted, sustainably sourced, effortlessly elegant.
        </motion.p>

        <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/catalog" className="btn-primary">Explore Collection</Link>
          <Link to="/stylist" className="btn-outline">Meet AI Stylist</Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            marginTop: 80, display: 'flex', gap: 64,
            borderTop: '1px solid #e2e8f0', paddingTop: 40, flexWrap: 'wrap', justifyContent: 'center'
          }}
        >
          {[['2,400+', 'Premium Items'], ['98%', 'Customer Satisfaction'], ['Free', 'Global Shipping']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{num}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Bento Grid ─────────────────────────── */}
      <section style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Collections</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>Featured This Season</h2>
          </div>
          <Link to="/catalog" style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textDecoration: 'none', borderBottom: '1.5px solid #0f172a', paddingBottom: 2 }}>
            View All
          </Link>
        </div>
        <BentoGrid />
      </section>

      {/* ── Features strip ─────────────────────── */}
      <section style={{ width: '100%', background: '#0f172a', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48 }}>
          {[
            ['🚀', 'Free Express Shipping', 'On all orders over Rs 5000.'],
            ['🤖', 'AI Personal Stylist', 'Get personalised outfit suggestions.'],
            ['↩️', 'Easy 30-Day Returns', 'Hassle-free returns, always.'],
            ['🌿', 'Sustainable Materials', 'Ethically sourced, planet-friendly.'],
          ].map(([icon, title, desc]) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────── */}
      <section style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 16 }}>Stay in the loop</p>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 12 }}>Get Early Access</h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 40 }}>Be first to know about new drops and exclusive offers.</p>
          <div style={{ display: 'flex', gap: 0, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1, minWidth: 240, padding: '14px 20px', border: '1.5px solid #e2e8f0',
                outline: 'none', fontSize: 14, color: '#0f172a', background: '#fff',
                borderRight: 'none',
              }}
            />
              <button 
                onClick={() => setSubscribed(true)} 
                className="btn-primary" 
                style={{ whiteSpace: 'nowrap', background: subscribed ? '#22c55e' : '#0f172a' }}
              >
                {subscribed ? 'Subscribed! ✓' : 'Subscribe'}
              </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
