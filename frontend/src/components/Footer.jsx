import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '64px 24px 40px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48, marginBottom: 64 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: '#f8fafc', marginBottom: 16 }}>VOGUEVAULT</div>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>Premium clothing for the modern minimalist. Crafted with intention, worn with purpose.</p>
        </div>
        {[
          { title: 'Shop', links: ['New Arrivals', 'Collections', 'Sale'] },
          { title: 'Help', links: ['Sizing Guide', 'Returns', 'Contact'] },
          { title: 'Company', links: ['About', 'Sustainability', 'Careers'] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#f8fafc', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
            {col.links.map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <Link to="/catalog" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>{l}</Link>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12 }}>© 2026 VogueVault. All rights reserved.</span>
        <span style={{ fontSize: 12 }}>Privacy · Terms · Cookies</span>
      </div>
    </div>
  </footer>
);

export default Footer;
