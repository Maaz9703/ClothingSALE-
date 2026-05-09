import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react';
import { getAdminStats } from '../../services/api';

const STATUS_COLOR = { Pending: '#f59e0b', Processing: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#22c55e', Cancelled: '#ef4444' };

function StatCard({ title, value, icon: Icon, color, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '28px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
        <div style={{ width: 40, height: 40, background: color + '20', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em' }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={12} color="#22c55e" /> {sub}</div>}
      </div>
    </motion.div>
  );
}



export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    getAdminStats()
      .then(data => { setStats(data); setDbStatus('connected'); })
      .catch(() => { setStats(null); setDbStatus('offline'); })
      .finally(() => setLoading(false));
  }, []);

  const s = stats || { totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0, recentOrders: [] };

  return (
    <div style={{ padding: '36px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Welcome back, Admin · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
          borderRadius: 99, fontSize: 12, fontWeight: 600,
          background: dbStatus === 'connected' ? '#dcfce7' : dbStatus === 'offline' ? '#fef3c7' : '#f1f5f9',
          color: dbStatus === 'connected' ? '#16a34a' : dbStatus === 'offline' ? '#d97706' : '#94a3b8',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor' }} />
          {dbStatus === 'connected' ? 'MongoDB Connected' : dbStatus === 'offline' ? 'Backend Offline' : 'Connecting…'}
        </span>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
        <StatCard title="Total Revenue" value={`Rs ${s.totalRevenue?.toLocaleString()}`} icon={DollarSign} color="#22c55e" sub="+12.4% this month" />
        <StatCard title="Total Orders" value={s.totalOrders} icon={ShoppingCart} color="#3b82f6" sub="+3 today" />
        <StatCard title="Products" value={s.totalProducts} icon={Package} color="#8b5cf6" sub="8 categories" />
        <StatCard title="Customers" value={s.totalUsers} icon={Users} color="#f59e0b" sub="+2 this week" />
      </div>

      {/* Quick-Status Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 36 }}>
        {[
          { label: 'Pending', icon: Clock, color: '#f59e0b', count: 1 },
          { label: 'Processing', icon: TrendingUp, color: '#3b82f6', count: 1 },
          { label: 'Shipped', icon: Truck, color: '#8b5cf6', count: 1 },
          { label: 'Delivered', icon: CheckCircle, color: '#22c55e', count: 2 },
        ].map(item => (
          <div key={item.label} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <item.icon size={18} color={item.color} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{item.count}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Recent Orders</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(s.recentOrders || []).map((order, i) => (
                <motion.tr key={order._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ borderTop: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{order.customer}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#0f172a', fontWeight: 700 }}>Rs {order.total}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: STATUS_COLOR[order.status] + '20', color: STATUS_COLOR[order.status] }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 13, color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
