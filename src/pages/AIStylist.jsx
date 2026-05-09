import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Find me a minimalist winter outfit',
  'What to wear for a business meeting?',
  'Suggest a casual weekend look',
  'Recommend accessories for a black dress',
];

const RESPONSES = {
  default: [
    { role: 'assistant', text: "Great choice! I'd recommend pairing our **Minimalist Winter Coat** ($299) with the **Cashmere Sweater** ($150) for a clean, refined layered look. Add a **Silk Scarf** ($45) for an elevated accent." },
    { role: 'assistant', text: "Perfect for the season! I suggest our **Merino Turtleneck** ($120) paired with straight-leg trousers. The monochromatic approach is very on-trend right now." },
    { role: 'assistant', text: "A timeless pick! I recommend our **Linen Blazer** ($220) over a white tee. Add our **Leather Belt** ($65) to complete the look — effortless and polished." },
  ],
};

let responseIndex = 0;

const AIStylist = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your personal AI Stylist. Tell me about your style needs and I'll curate the perfect outfit from our VogueVault collection! ✨" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = RESPONSES.default[responseIndex % RESPONSES.default.length];
      responseIndex++;
      setMessages(m => [...m, reply]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto 100px', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: '#0f172a', borderRadius: '50%', marginBottom: 20 }}>
          <Sparkles size={24} color="#fff" />
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 12 }}>AI Stylist</h1>
        <p style={{ fontSize: 16, color: '#64748b' }}>Your personal shopping assistant, powered by AI.</p>
      </div>

      {/* Chat Container */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 40px rgba(0,0,0,0.06)' }}>
        {/* Messages */}
        <div style={{ height: 420, overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end' }}
              >
                {msg.role === 'assistant' && (
                  <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '12px 18px', fontSize: 14, lineHeight: 1.65,
                  background: msg.role === 'user' ? '#0f172a' : '#f8fafc',
                  color: msg.role === 'user' ? '#fff' : '#0f172a',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                }}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: 32, height: 32, background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} color="#64748b" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#fff" />
              </div>
              <div style={{ padding: '12px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i*0.15 }}
                    style={{ width: 6, height: 6, background: '#94a3b8', borderRadius: '50%' }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggestions */}
        <div style={{ padding: '0 24px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{
              padding: '6px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', transition: 'all 0.2s',
            }}>{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', borderTop: '1px solid #e2e8f0' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your style need…"
            style={{
              flex: 1, padding: '18px 20px', border: 'none', outline: 'none',
              fontSize: 14, color: '#0f172a', background: 'transparent',
            }}
          />
          <button onClick={() => sendMessage(input)} style={{
            padding: '0 24px', background: '#0f172a', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
          }}>
            <Send size={18} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIStylist;
