import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, CheckCircle2 } from 'lucide-react';
import { createOrder } from '../services/api';

const Cart = ({ cartItems = [], setCartItems, user }) => {
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
  });

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const removeItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setError('');

    // Basic Validation
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError('Please fill in all the required details.');
      return;
    }

    setCheckingOut(true);
    
    // Group items for order schema
    const itemMap = {};
    cartItems.forEach(item => {
      if (itemMap[item.name]) itemMap[item.name].qty++;
      else itemMap[item.name] = { name: item.name, price: item.price, qty: 1 };
    });
    
    const orderData = {
      customer: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      paymentMethod: form.paymentMethod,
      items: Object.values(itemMap),
      total: total,
    };

    try {
      await createOrder(orderData);
      setCheckingOut(false);
      setOrderPlaced(true);
      setCartItems([]);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to backend. Please ensure the server is running.');
      setCheckingOut(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', outline: 'none',
    fontSize: 14, color: '#0f172a', background: '#fff', boxSizing: 'border-box', marginBottom: 16
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase'
  };

  if (orderPlaced) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto 100px', padding: '0 24px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '80px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Order Placed Successfully!</h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>Thank you for your purchase. We've received your order and will process it shortly.</p>
          <Link to="/catalog" className="btn-primary">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto 100px', padding: '0 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Your</p>
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>Shopping Bag</h1>
      </div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', background: '#fff', border: '1px solid #e2e8f0' }}
        >
          <ShoppingBag size={56} color="#e2e8f0" strokeWidth={1.2} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginTop: 24, marginBottom: 12 }}>Your bag is empty</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32, textAlign: 'center' }}>Add items from the catalog to get started.</p>
          <Link to="/catalog" className="btn-primary">Explore Collection</Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'flex-start' }}
        >
          {/* Cart Items List */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Order Summary</h2>
            </div>
            {cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', padding: '24px', borderBottom: index < cartItems.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 80, height: 100, background: '#f8fafc', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{item.name}</h3>
                  <p style={{ fontSize: 13, color: '#64748b' }}>{item.category}</p>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                  Rs {item.price}
                </div>
                <button
                  onClick={() => removeItem(index)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 8 }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          {/* Checkout Form */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Checkout Details</h2>
            
            <form onSubmit={handleCheckout}>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} required />

              <label style={labelStyle}>Email Address *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} required />

              <label style={labelStyle}>Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} required />

              <label style={labelStyle}>Shipping Address *</label>
              <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={3} style={{...inputStyle, resize: 'vertical', fontFamily: 'inherit'}} required />

              <label style={labelStyle}>Payment Method</label>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '12px', border: form.paymentMethod === 'COD' ? '2px solid #0f172a' : '1.5px solid #e2e8f0', background: form.paymentMethod === 'COD' ? '#f8fafc' : '#fff', cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={form.paymentMethod === 'COD'} onChange={() => setForm({...form, paymentMethod: 'COD'})} style={{ margin: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Cash on Delivery</span>
                </label>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '12px', border: form.paymentMethod === 'Card' ? '2px solid #0f172a' : '1.5px solid #e2e8f0', background: form.paymentMethod === 'Card' ? '#f8fafc' : '#fff', cursor: 'pointer', opacity: 0.5 }}>
                  <input type="radio" name="payment" disabled style={{ margin: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Card (Coming Soon)</span>
                </label>
              </div>

              {error && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>{error}</div>}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 15, color: '#64748b' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Rs {total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 15, color: '#64748b' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 18, fontWeight: 800, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <span>Total</span>
                <span>Rs {total}</span>
              </div>

              <button 
                type="submit"
                disabled={checkingOut}
                className="btn-primary" 
                style={{ width: '100%', opacity: checkingOut ? 0.7 : 1, cursor: checkingOut ? 'wait' : 'pointer' }}
              >
                {checkingOut ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </motion.div>
      )}
      
      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
