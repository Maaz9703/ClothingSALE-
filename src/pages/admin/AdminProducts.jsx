import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Package } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

const CATS = ['Outerwear', 'Knitwear', 'Accessories', 'Tops', 'Bottoms', 'Footwear'];



const EMPTY = { name: '', price: '', category: 'Outerwear', imageUrl: '', description: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  function openAdd() { setForm(EMPTY); setModal('add'); }
  function openEdit(p) { setForm({ name: p.name, price: p.price, category: p.category, imageUrl: p.imageUrl || '', description: p.description || '' }); setModal(p); }

  async function save() {
    if (!form.name || !form.price) {
      showToast('Name and Price are required.');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'add') {
        const p = await createProduct({ ...form, price: Number(form.price) });
        setProducts(prev => [...prev, p]);
        showToast('Product created ✓');
      } else {
        const p = await updateProduct(modal._id, { ...form, price: Number(form.price) });
        setProducts(prev => prev.map(x => x._id === p._id ? p : x));
        showToast('Product updated ✓');
      }
    } catch (err) {
      showToast(err.message || 'Error: Could not save product.');
    } finally {
      setSaving(false);
      setModal(null);
    }
  }

  async function confirmDelete() {
    try { await deleteProduct(deleteId); } catch { }
    setProducts(prev => prev.filter(p => p._id !== deleteId));
    setDeleteId(null);
    showToast('Product deleted');
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: 14, color: '#0f172a', boxSizing: 'border-box', transition: 'border-color 0.2s', background: '#fff' };

  return (
    <div style={{ padding: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>Products</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{products.length} items in catalog</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', border: 'none', padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ background: '#f1f5f9', height: 300, animation: 'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {products.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: '#fff', border: '1px solid #e2e8f0', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f8fafc' }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={48} color="#e2e8f0" />
                  </div>
                )}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase' }}>{p.category}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 4, marginBottom: 4 }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14, lineHeight: 1.4, WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>{p.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Rs {p.price}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '7px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(p._id)} style={{ padding: '7px 12px', background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => setModal(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#fff', width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{modal === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[['Name', 'name', 'text'], ['Price (Rs)', 'price', 'number'], ['Image URL', 'imageUrl', 'url']].map(([label, key, type]) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle }}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, padding: '0 24px 24px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModal(null)} style={{ padding: '10px 20px', background: 'transparent', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Cancel</button>
                <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#0f172a', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={14} /> {saving ? 'Saving…' : (modal === 'add' ? 'Create Product' : 'Save Changes')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#fff', maxWidth: 380, width: '100%', padding: 32, textAlign: 'center' }}>
              <Trash2 size={36} color="#ef4444" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Delete Product?</h3>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: '10px 24px', background: 'transparent', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
                <button onClick={confirmDelete} style={{ padding: '10px 24px', background: '#ef4444', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#fff' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 500, background: '#0f172a', color: '#fff', padding: '12px 20px', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Check size={15} color="#22c55e" /> {toast}
        </motion.div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
