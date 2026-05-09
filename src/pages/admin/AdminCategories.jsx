import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';

const EMPTY = { name: '', description: '', icon: '🏷️' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([])).finally(() => setLoading(false));
  }, []);

  function openAdd() { setForm(EMPTY); setModal('add'); }
  function openEdit(c) { setForm({ name: c.name, description: c.description || '', icon: c.icon || '🏷️' }); setModal(c); }

  async function save() {
    if (!form.name) return showToast('Name is required.');
    setSaving(true);
    try {
      if (modal === 'add') {
        const c = await createCategory(form);
        setCategories(prev => [...prev, c]);
        showToast('Category added');
      } else {
        const c = await updateCategory(modal._id, form);
        setCategories(prev => prev.map(x => x._id === c._id ? c : x));
        showToast('Category updated');
      }
    } catch (err) {
      showToast(err.message || 'Error saving category');
    } finally {
      setSaving(false);
      setModal(null);
    }
  }

  async function confirmDelete() {
    try { await deleteCategory(deleteId); } catch { }
    setCategories(prev => prev.filter(c => c._id !== deleteId));
    setDeleteId(null);
    showToast('Category deleted');
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: 14, color: '#0f172a', boxSizing: 'border-box', background: '#fff' };

  return (
    <div style={{ padding: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>Categories</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{categories.length} categories defined</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', border: 'none', padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Description</th>
              <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b' }}>{c.description}</td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => openEdit(c)} style={{ padding: 8, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#475569' }}><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(c._id)} style={{ padding: 8, background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#fff', width: 400, padding: 24 }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{modal === 'add' ? 'Add Category' : 'Edit Category'}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Icon (Emoji)</label>
                  <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, height: 80 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                <button onClick={() => setModal(null)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Delete Category?</h3>
              <p style={{ color: '#64748b', marginBottom: 24 }}>This may affect products using this category.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', background: 'none', cursor: 'pointer' }}>Cancel</button>
                <button onClick={confirmDelete} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={{ position: 'fixed', bottom: 32, right: 32, background: '#0f172a', color: '#fff', padding: '12px 24px', borderRadius: 4 }}>
          {toast}
        </motion.div>
      )}
    </div>
  );
}
