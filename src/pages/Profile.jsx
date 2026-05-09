import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function Profile({ user, onLogout }) {
  if (!user) return <div style={{ padding: 100, textAlign: 'center' }}>Please login to view profile.</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '120px 24px 60px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ background: '#0f172a', padding: '48px 40px', color: '#fff', display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 80, height: 80, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
              <span style={{ fontSize: 32, fontWeight: 900 }}>{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{user.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14 }}>
                <Shield size={14} /> {user.role.toUpperCase()} ACCOUNT
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              
              <section>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Account Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>Full Name</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>Email Address</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{user.email}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Activity</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#f8fafc', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>0</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Orders</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>0</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Wishlist</div>
                  </div>
                </div>
              </section>
            </div>

            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12 }}>
              <button style={{ padding: '12px 24px', background: '#f1f5f9', border: 'none', borderRadius: 0, fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} /> Edit Profile
              </button>
              <button onClick={onLogout} style={{ padding: '12px 24px', background: '#fef2f2', border: 'none', borderRadius: 0, fontSize: 14, fontWeight: 600, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
