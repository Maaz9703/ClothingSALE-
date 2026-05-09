import React, { useState } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  LogOut, ChevronRight, Menu, X, ExternalLink
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Products', icon: Package, to: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, to: '/admin/orders' },
  { label: 'Users', icon: Users, to: '/admin/users' },
];

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const SIDEBAR = ({ mobile = false }) => (
    <aside style={{
      width: mobile ? '100%' : 240,
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      minHeight: mobile ? 'auto' : '100vh',
      position: mobile ? 'relative' : 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.05em', color: '#f8fafc' }}>VOGUEVAULT</div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2, letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>Admin Panel</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderRadius: 8, textDecoration: 'none', transition: 'all 0.15s',
                background: active ? '#1e293b' : 'transparent',
                color: active ? '#f8fafc' : '#64748b',
                fontWeight: active ? 600 : 400,
                fontSize: 13,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#f8fafc'; }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
            >
              <item.icon size={16} />
              {item.label}
              {active && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link to="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', fontSize: 13, color: '#64748b', textDecoration: 'none', borderRadius: 8 }}>
          <ExternalLink size={15} /> View Store
        </Link>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444', textDecoration: 'none', borderRadius: 8 }}>
          <LogOut size={15} /> Exit Panel
        </Link>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desk">
        <SIDEBAR />
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div className="admin-topbar-mob" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.04em' }}>VOGUEVAULT · Admin</span>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f8fafc' }}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)' }} onClick={() => setSidebarOpen(false)}>
              <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ width: 260, height: '100%' }} onClick={e => e.stopPropagation()}
              >
                <SIDEBAR mobile />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar-desk { display: block !important; }
          .admin-topbar-mob { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-sidebar-desk { display: none !important; }
          .admin-topbar-mob { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
