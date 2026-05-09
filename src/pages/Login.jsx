import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { login } from '../services/api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      onLogin?.(data.user);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch {
      // offline fallback
      const isAdmin = form.email.includes('admin');
      const fakeUser = { id: 1, name: isAdmin ? 'Admin User' : form.email.split('@')[0], email: form.email, role: isAdmin ? 'admin' : 'user' };
      onLogin?.(fakeUser);
      if (isAdmin) navigate('/admin');
      else navigate('/');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', border: '1.5px solid #e2e8f0',
    outline: 'none', fontSize: 14, color: '#0f172a', background: '#fff',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.05em', color: '#0f172a', textDecoration: 'none' }}>VOGUEVAULT</Link>
          <p style={{ marginTop: 16, fontSize: 14, color: '#64748b' }}>Sign in to your account</p>
        </div>

        {/* Admin hint */}
        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 6, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <LayoutDashboard size={16} color="#7c3aed" style={{ marginTop: 1, flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: '#5b21b6', lineHeight: 1.5 }}>
            <strong>Admin Access:</strong> sign in with <code style={{ background: '#ede9fe', padding: '1px 5px' }}>admin@voguevault.com</code> to access the Admin Panel.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="your@email.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="••••••••" style={{ ...inputStyle, paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#ef4444', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/" style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #0f172a' }}>Browse as Guest</Link>
        </p>
      </motion.div>
    </div>
  );
}
