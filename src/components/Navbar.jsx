import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingBag, User, Menu, X, ChevronDown,
  Heart, Bell, Settings, LogOut, LayoutDashboard, Tag,
  Truck, Flame, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { label: 'Outerwear', desc: 'Coats, jackets & more', icon: '🧥' },
  { label: 'Knitwear', desc: 'Sweaters & knits', icon: '🧶' },
  { label: 'Accessories', desc: 'Scarves, belts & bags', icon: '👜' },
  { label: 'Tops', desc: 'Blouses & shirts', icon: '👕' },
];

const ANNOUNCEMENT = '✨  Free express shipping on orders over Rs 5000  ·  New Winter Collection now live  ✨';

export default function Navbar({ cartCount = 0, wishlistCount = 0, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCollectionsOpen(false);
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    position: 'fixed', top: 0, width: '100%', zIndex: 100,
    background: scrolled ? 'rgba(248,250,252,0.96)' : 'rgba(248,250,252,0.90)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid transparent',
    transition: 'all 0.3s ease',
  };

  return (
    <>
      {/* ─── Announcement Banner ─────────────────────────────────── */}
      <div style={{ background: '#0f172a', color: '#94a3b8', textAlign: 'center', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', padding: '10px 16px' }}>
        {ANNOUNCEMENT}
      </div>

      {/* ─── Main Navbar ─────────────────────────────────────────── */}
      <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} style={navStyle}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 68, gap: 0 }}>

          {/* Logo */}
          <Link to="/" style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.06em', color: '#0f172a', textDecoration: 'none', marginRight: 48, flexShrink: 0 }}>
            VOGUEVAULT
          </Link>

          {/* ─ Desktop Nav ───── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1 }} className="desk-nav">

            {/* Collections Dropdown */}
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                color: collectionsOpen ? '#0f172a' : '#475569', transition: 'color 0.2s',
              }}>
                Collections <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: collectionsOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: 'absolute', top: '100%', left: 0, minWidth: 340,
                      background: '#fff', border: '1px solid #e2e8f0',
                      boxShadow: '0 24px 64px rgba(0,0,0,0.1)', padding: 20,
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
                    }}
                  >
                    {CATEGORIES.map(cat => (
                      <Link key={cat.label} to={`/catalog?cat=${cat.label}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', textDecoration: 'none', borderRadius: 6, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: 22 }}>{cat.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{cat.label}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{cat.desc}</div>
                        </div>
                      </Link>
                    ))}
                    <div style={{ gridColumn: '1/-1', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
                      <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#0f172a', textDecoration: 'none', padding: '6px 12px', background: '#f1f5f9' }}>
                        <Flame size={13} /> New Arrivals
                      </Link>
                      <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#0f172a', textDecoration: 'none', padding: '6px 12px', background: '#f1f5f9' }}>
                        <Star size={13} /> Best Sellers
                      </Link>
                      <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#dc2626', textDecoration: 'none', padding: '6px 12px', background: '#fef2f2' }}>
                        <Tag size={13} /> Sale
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {[
              { label: 'New Arrivals', to: '/catalog' },
              { label: 'AI Stylist', to: '/stylist' },
              { label: 'Lookbook', to: '/catalog' },
            ].map(link => (
              <Link key={link.label} to={link.to} style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 500, textDecoration: 'none',
                color: isActive(link.to) ? '#0f172a' : '#475569',
                borderBottom: isActive(link.to) ? '2px solid #0f172a' : '2px solid transparent',
                transition: 'all 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ─ Search bar (expandable) ───── */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }} className="desk-nav">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div key="search" initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', border: '1.5px solid #0f172a', background: '#fff' }}
                >
                  <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { navigate('/catalog'); setSearchOpen(false); } if (e.key === 'Escape') setSearchOpen(false); }}
                    placeholder="Search products…"
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontSize: 13, color: '#0f172a', background: 'transparent' }}
                  />
                  <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px', color: '#94a3b8' }}>
                    <X size={15} />
                  </button>
                </motion.div>
              ) : (
                <motion.button key="icon" onClick={() => setSearchOpen(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#475569', display: 'flex', alignItems: 'center' }}
                >
                  <Search size={19} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#475569', position: 'relative', display: 'flex' }}>
                <Bell size={19} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: '#ef4444', borderRadius: '50%', border: '1.5px solid #f8fafc' }} />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}
                    style={{ position: 'absolute', right: 0, top: '120%', width: 300, background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 16px 48px rgba(0,0,0,0.1)', padding: 0 }}
                  >
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Notifications</div>
                    {[
                      { text: 'Your order has been shipped!', time: '2m ago', dot: '#22c55e' },
                      { text: 'New arrivals: Winter Edit is live', time: '1h ago', dot: '#3b82f6' },
                      { text: 'Your wishlist item is on sale', time: '3h ago', dot: '#f59e0b' },
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 18px', borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot, marginTop: 5, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.4 }}>{n.text}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link to="/catalog" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#475569', position: 'relative', display: 'flex', textDecoration: 'none' }}>
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, background: '#ef4444', borderRadius: '50%', fontSize: 8, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistCount}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#475569', position: 'relative', display: 'flex', textDecoration: 'none' }}>
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, background: '#0f172a', borderRadius: 99, fontSize: 9, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{cartCount}</span>
              )}
            </Link>

            {/* User menu */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(o => !o)}
                style={{ background: user ? '#0f172a' : 'none', border: user ? 'none' : '1.5px solid #e2e8f0', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4, color: user ? '#fff' : '#475569' }}
              >
                {user ? <span style={{ fontSize: 13, fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</span> : <User size={17} />}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}
                    style={{ position: 'absolute', right: 0, top: '120%', width: 220, background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
                  >
                    {user ? (
                      <>
                        <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{user.email}</div>
                        </div>
                        {user.role === 'admin' && (
                          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}
                            onMouseEnter={e => e.currentTarget.style.background = '#faf5ff'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <LayoutDashboard size={15} /> Admin Panel
                          </Link>
                        )}
                        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', fontSize: 13, color: '#0f172a', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <ShoppingBag size={15} /> My Orders
                        </Link>
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', fontSize: 13, color: '#0f172a', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Settings size={15} /> Settings
                        </Link>
                        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderTop: '1px solid #f1f5f9' }}>
                          <LogOut size={15} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" style={{ display: 'block', padding: '14px 18px', fontSize: 13, fontWeight: 600, color: '#0f172a', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          Sign In
                        </Link>
                        <div style={{ padding: '14px 18px', fontSize: 12, color: '#94a3b8' }}>
                          Sign in as <strong>admin@voguevault.com</strong> for admin access.
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─ Mobile hamburger ───── */}
          <button onClick={() => setMobileOpen(o => !o)} className="mob-only" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', marginLeft: 'auto', display: 'flex', padding: 8 }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* ─── Mobile Menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 108, left: 0, right: 0, zIndex: 99, background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            {[...CATEGORIES.map(c => ({ label: c.label, to: '/catalog' })),
              { label: 'New Arrivals', to: '/catalog' },
              { label: 'AI Stylist', to: '/stylist' },
              { label: 'Sign In', to: '/login' },
              { label: '🛠 Admin Panel', to: '/admin' },
            ].map(link => (
              <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                style={{ fontSize: 15, fontWeight: 500, color: '#0f172a', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .mob-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mob-only { display: none !important; }
          .desk-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
