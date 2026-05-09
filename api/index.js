require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── Seed Data ──────────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  { name: 'Minimalist Winter Coat', price: 299, category: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500', description: 'A sleek and warm minimalist coat for the cold season.' },
  { name: 'Cashmere Sweater', price: 150, category: 'Knitwear', imageUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500', description: 'Soft cashmere sweater for everyday elegance.' },
  { name: 'Silk Scarf', price: 45, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', description: 'Refined silk scarf with subtle geometric patterns.' },
  { name: 'Linen Blazer', price: 220, category: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4491?w=500', description: 'Clean tailored linen blazer, effortlessly versatile.' },
  { name: 'Merino Turtleneck', price: 120, category: 'Knitwear', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', description: 'Ultra-soft Merino wool turtleneck with a relaxed fit.' },
  { name: 'Leather Belt', price: 65, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=500', description: 'Full-grain leather belt with a brushed matte buckle.' },
  { name: 'Wool Trench Coat', price: 350, category: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', description: 'A classic wool trench for timeless elegance.' },
  { name: 'Silk Blouse', price: 185, category: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', description: 'Fluid silk blouse, perfect for day-to-evening dressing.' },
];

const SEED_ORDERS = [
  { customer: 'Sophia Chen', email: 'sophia@example.com', phone: '123-456-7890', paymentMethod: 'COD', items: [{ name: 'Cashmere Sweater', price: 150, qty: 1 }, { name: 'Silk Scarf', price: 45, qty: 2 }], total: 240, status: 'Delivered', address: '12 Park Ave, New York, NY' },
  { customer: 'James Wright', email: 'james@example.com', phone: '123-456-7890', paymentMethod: 'COD', items: [{ name: 'Minimalist Winter Coat', price: 299, qty: 1 }], total: 299, status: 'Shipped', address: '88 Queen St, London, UK' },
  { customer: 'Amara Diallo', email: 'amara@example.com', phone: '123-456-7890', paymentMethod: 'COD', items: [{ name: 'Linen Blazer', price: 220, qty: 1 }, { name: 'Leather Belt', price: 65, qty: 1 }], total: 285, status: 'Processing', address: '44 Rue de Rivoli, Paris, FR' },
];

const SEED_USERS = [
  { name: 'Sophia Chen', email: 'sophia@example.com', role: 'user', orders: 4, totalSpent: 840 },
  { name: 'Admin User', email: 'admin@voguevault.com', role: 'admin', orders: 0, totalSpent: 0 },
];

// ── Local Fallback Mode ────────────────────────────────────────────────────────
let useLocalDB = false;
let localProducts = SEED_PRODUCTS.map((p, i) => ({ ...p, _id: String(i + 1), createdAt: new Date() }));
let localOrders = SEED_ORDERS.map((o, i) => ({ ...o, _id: String(i + 1), createdAt: new Date() }));
let localUsers = SEED_USERS.map((u, i) => ({ ...u, _id: String(i + 1), createdAt: new Date() }));


// ── MongoDB ────────────────────────────────────────────────────────────────────
// Attempt connection but fail fast (2 seconds timeout) to avoid UI hanging
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log('✅ MongoDB Connected — cluster0.m5bqm8i.mongodb.net');
    await seedIfEmpty(); 
  })
  .catch(err => {
    console.error('❌ MongoDB Timeout/Error:', err.message);
    console.log('⚠️ Switching to Local In-Memory Database Mode for 100% reliability...');
    useLocalDB = true;
  });

async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  console.log('🌱 Auto-seeding database...');
  await Product.insertMany(SEED_PRODUCTS);
  await Order.insertMany(SEED_ORDERS);
  await User.insertMany(SEED_USERS);
  console.log('🌱 Seed complete.');
}

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const states = { 0:'disconnected', 1:'connected', 2:'connecting', 3:'disconnecting' };
  res.json({ status: 'ok', db: useLocalDB ? 'local_memory' : states[mongoose.connection.readyState], timestamp: new Date().toISOString() });
});

// ── Admin Stats ────────────────────────────────────────────────────────────────
app.get('/api/admin/stats', async (req, res) => {
  try {
    if (useLocalDB) {
      const totalRevenue = localOrders.reduce((sum, o) => sum + o.total, 0);
      const recentOrders = [...localOrders].sort((a,b) => b.createdAt - a.createdAt).slice(0, 5);
      return res.json({ totalProducts: localProducts.length, totalOrders: localOrders.length, totalUsers: localUsers.length, totalRevenue, recentOrders });
    }
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments(), Order.countDocuments(), User.countDocuments(), Order.find()
    ]);
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({ totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch stats' }); }
});

// ── Products ───────────────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const filterCat = req.query.category && req.query.category !== 'All' ? req.query.category : null;
    if (useLocalDB) {
      return res.json(filterCat ? localProducts.filter(p => p.category === filterCat) : localProducts);
    }
    const filter = filterCat ? { category: filterCat } : {};
    res.json(await Product.find(filter));
  } catch { res.status(500).json({ error: 'Failed to fetch products' }); }
});

app.post('/api/products', async (req, res) => {
  try {
    if (useLocalDB) {
      if (!req.body.name || !req.body.price) throw new Error('Name and price are required.');
      const p = { ...req.body, _id: Date.now().toString(), createdAt: new Date() };
      localProducts.push(p);
      return res.status(201).json(p);
    }
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    if (useLocalDB) {
      const idx = localProducts.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      localProducts[idx] = { ...localProducts[idx], ...req.body };
      return res.json(localProducts[idx]);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    if (useLocalDB) {
      localProducts = localProducts.filter(p => p._id !== req.params.id);
      return res.json({ message: 'Product deleted' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch { res.status(500).json({ error: 'Failed to delete product' }); }
});

app.post('/api/products/seed', async (req, res) => {
  try {
    if (useLocalDB) {
      localProducts = SEED_PRODUCTS.map((p, i) => ({ ...p, _id: String(i + 1), createdAt: new Date() }));
      localOrders = SEED_ORDERS.map((o, i) => ({ ...o, _id: String(i + 1), createdAt: new Date() }));
      localUsers = SEED_USERS.map((u, i) => ({ ...u, _id: String(i + 1), createdAt: new Date() }));
      return res.json({ message: 'Local Database seeded' });
    }
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    const products = await Product.insertMany(SEED_PRODUCTS);
    const orders = await Order.insertMany(SEED_ORDERS);
    const users = await User.insertMany(SEED_USERS);
    res.json({ message: 'Database seeded', products: products.length, orders: orders.length, users: users.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Orders ─────────────────────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    if (useLocalDB) return res.json([...localOrders].sort((a,b) => b.createdAt - a.createdAt));
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch { res.status(500).json({ error: 'Failed to fetch orders' }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    if (useLocalDB) {
      const o = { ...req.body, status: 'Pending', _id: Date.now().toString(), createdAt: new Date() };
      localOrders.push(o);
      return res.status(201).json(o);
    }
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    if (useLocalDB) {
      const idx = localOrders.findIndex(o => o._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      localOrders[idx].status = req.body.status;
      return res.json(localOrders[idx]);
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch { res.status(500).json({ error: 'Failed to update order' }); }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    if (useLocalDB) {
      localOrders = localOrders.filter(o => o._id !== req.params.id);
      return res.json({ message: 'Deleted' });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch { res.status(500).json({ error: 'Failed to delete order' }); }
});

// ── Users ──────────────────────────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    if (useLocalDB) return res.json(localUsers);
    res.json(await User.find().sort({ createdAt: -1 }));
  } catch { res.status(500).json({ error: 'Failed to fetch users' }); }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    if (useLocalDB) {
      localUsers = localUsers.filter(u => u._id !== req.params.id);
      return res.json({ message: 'Deleted' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch { res.status(500).json({ error: 'Failed to delete user' }); }
});

// ── Auth ───────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const isAdmin = email.includes('admin');
  res.json({ token: 'mock-jwt-token', user: { id: 1, name: isAdmin ? 'Admin User' : 'VogueVault Member', email, role: isAdmin ? 'admin' : 'user' } });
});

// ── Start / Vercel Export ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server   → http://localhost:${PORT}`);
    console.log(`📋 Health   → http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
