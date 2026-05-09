import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check, Trash2 } from 'lucide-react';
import { getOrders, updateOrder, deleteOrder } from '../../services/api';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLOR = { Pending: '#f59e0b', Processing: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#22c55e', Cancelled: '#ef4444' };



export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    getOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  async function changeStatus(id, status) {
    try { await updateOrder(id, status); } catch { }
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    showToast(`Order status updated to ${status}`);
  }

  async function removeOrder(id) {
    try { await deleteOrder(id); } catch { }
    setOrders(prev => prev.filter(o => o._id !== id));
    showToast('Order deleted');
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={{ padding: '36px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>Orders</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['All', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid', transition: 'all 0.2s',
            background: filter === s ? (s === 'All' ? '#0f172a' : STATUS_COLOR[s]) : 'transparent',
            color: filter === s ? '#fff' : (s === 'All' ? '#0f172a' : STATUS_COLOR[s]),
            borderColor: s === 'All' ? '#0f172a' : STATUS_COLOR[s],
          }}>{s}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading orders…</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Customer', 'Email', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <React.Fragment key={order._id}>
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        <button onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#0f172a' }}
                        >
                          <ChevronDown size={14} style={{ transform: expanded === order._id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                          {order.customer}
                        </button>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b' }}>{order.email}</td>
                      <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Rs {order.total}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <select value={order.status} onChange={e => changeStatus(order._id, e.target.value)}
                          style={{ padding: '5px 10px', border: `1.5px solid ${STATUS_COLOR[order.status]}`, fontSize: 12, fontWeight: 700, color: STATUS_COLOR[order.status], background: STATUS_COLOR[order.status] + '15', cursor: 'pointer', outline: 'none' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <button onClick={() => removeOrder(order._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 6 }}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </motion.tr>
                    {/* Expanded row */}
                    {expanded === order._id && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0 20px 16px 48px', background: '#f8fafc' }}>
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>📍 {order.address}</div>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr>{['Item', 'Price', 'Qty', 'Subtotal'].map(h => <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '4px 8px' }}>{h}</th>)}</tr></thead>
                            <tbody>
                              {(order.items || []).map((item, j) => (
                                <tr key={j}>
                                  <td style={{ padding: '4px 8px', fontSize: 13, color: '#0f172a' }}>{item.name}</td>
                                  <td style={{ padding: '4px 8px', fontSize: 13, color: '#64748b' }}>Rs {item.price}</td>
                                  <td style={{ padding: '4px 8px', fontSize: 13, color: '#64748b', textAlign: 'center' }}>x{item.qty}</td>
                                  <td style={{ padding: '4px 8px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Rs {item.price * item.qty}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
