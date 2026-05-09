import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Check, Shield } from 'lucide-react';
import { getUsers, deleteUser } from '../../services/api';



function Avatar({ name, size = 36 }) {
  const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#0f172a'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.38, fontWeight: 800, color: '#fff' }}>{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    getUsers().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  async function remove(id) {
    try { await deleteUser(id); } catch { }
    setUsers(prev => prev.filter(u => u._id !== id));
    showToast('User removed');
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);

  return (
    <div style={{ padding: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>Customers</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{users.length} registered users · Rs {totalRevenue.toLocaleString()} total revenue</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: 14, width: 280, color: '#0f172a', background: '#fff', boxSizing: 'border-box' }}
        />
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Customers', value: users.length },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length },
          { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}` },
          { label: 'Avg. Spent', value: `Rs ${users.length ? Math.round(totalRevenue / users.filter(u => u.role === 'user').length || 0) : 0}` },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading users…</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Customer', 'Email', 'Role', 'Orders', 'Total Spent', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderTop: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={user.name} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b' }}>{user.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                        background: user.role === 'admin' ? '#7c3aed20' : '#f1f5f9',
                        color: user.role === 'admin' ? '#7c3aed' : '#64748b',
                      }}>
                        {user.role === 'admin' && <Shield size={10} />}
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{user.orders}</td>
                    <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Rs {(user.totalSpent || 0).toLocaleString()}</td>
                    <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 20px' }}>
                      {user.role !== 'admin' && (
                        <button onClick={() => remove(user._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 6 }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toast && (
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 500, background: '#0f172a', color: '#fff', padding: '12px 20px', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Check size={15} color="#22c55e" /> {toast}
        </motion.div>
      )}
    </div>
  );
}
