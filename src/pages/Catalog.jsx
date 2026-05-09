import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Filter, X } from 'lucide-react';
import { getProducts, seedProducts } from '../services/api';

const CATEGORIES = ['All', 'Outerwear', 'Knitwear', 'Accessories'];



const Catalog = ({ onCartAdd, onWishlist }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      if (data.length === 0) {
        // Auto-seed if DB is empty
        const seeded = await seedProducts();
        setProducts(seeded.products || FALLBACK);
        setFiltered(seeded.products || FALLBACK);
      } else {
        setProducts(data);
        setFiltered(data);
      }
      setBackendStatus('connected');
    } catch (err) {
      console.error(err);
      setProducts([]);
      setFiltered([]);
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setFiltered(category === 'All' ? products : products.filter(p => p.category === category));
  }, [category, products]);

  function toggleWishlist(id) {
    setWishlist(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);
  }

  function addToCart(product) {
    setCart(c => [...c, product]);
    if (onCartAdd) onCartAdd(product);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 2500);
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 100px' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Shop</p>
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 12 }}>All Collections</h1>
        {/* Backend status pill */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          background: backendStatus === 'connected' ? '#dcfce7' : backendStatus === 'offline' ? '#fef3c7' : '#f1f5f9',
          color: backendStatus === 'connected' ? '#16a34a' : backendStatus === 'offline' ? '#d97706' : '#94a3b8',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          {backendStatus === 'connected' ? 'Live from MongoDB' : backendStatus === 'offline' ? 'Backend Offline (No Data)' : 'Connecting…'}
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={16} style={{ color: '#94a3b8' }} />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '8px 20px', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
              border: '1.5px solid', borderRadius: 0, cursor: 'pointer', transition: 'all 0.2s',
              background: category === cat ? '#0f172a' : 'transparent',
              color: category === cat ? '#fff' : '#64748b',
              borderColor: category === cat ? '#0f172a' : '#e2e8f0',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background: '#f1f5f9', height: 380, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="product-card"
              style={{ background: '#fff', border: '1px solid #f1f5f9', overflow: 'hidden', cursor: 'pointer' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', overflow: 'hidden', height: 320 }}>
                <motion.img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500'}
                  alt={product.name}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.6 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Wishlist */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <Heart size={16} fill={wishlist.includes(product._id) ? '#ef4444' : 'none'} color={wishlist.includes(product._id) ? '#ef4444' : '#64748b'} />
                </button>
              </div>
              {/* Info */}
              <div style={{ padding: '20px 20px 24px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>{product.category}</p>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{product.name}</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>{product.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Rs {product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: '#0f172a', color: '#fff',
                      padding: '10px 18px', border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, transition: 'background 0.2s',
                    }}
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Cart Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          style={{
            position: 'fixed', bottom: 32, right: 32, zIndex: 1000,
            background: '#0f172a', color: '#fff', padding: '14px 22px',
            fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <ShoppingBag size={16} /> {notification}
        </motion.div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};

export default Catalog;
