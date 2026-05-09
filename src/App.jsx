import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AIStylist from './pages/AIStylist';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AdminPanel from './pages/admin/AdminPanel';

export default function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    setUser(null);
  }

  // Pages that should NOT show the main navbar/footer
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <Router>
      <AppContent
        user={user}
        cartItems={cartItems}
        wishlistCount={wishlistCount}
        onLogin={handleLogin}
        onLogout={handleLogout}
        setCartItems={setCartItems}
        setWishlistCount={setWishlistCount}
      />
    </Router>
  );
}

function AppContent({ user, cartItems, wishlistCount, onLogin, onLogout, setCartItems, setWishlistCount }) {
  return (
    <Routes>
      {/* Admin routes — no main navbar/footer */}
      <Route path="/admin/*" element={<AdminPanel />} />

      {/* Main store routes */}
      <Route path="/*" element={
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          <Navbar
            user={user}
            cartCount={cartItems.length}
            wishlistCount={wishlistCount}
            onLogout={onLogout}
          />
          <main style={{ flex: 1, paddingTop: 108 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog onCartAdd={(product) => setCartItems(prev => [...prev, product])} onWishlist={() => setWishlistCount(w => w + 1)} />} />
              <Route path="/stylist" element={<AIStylist />} />
              <Route path="/login" element={<Login onLogin={onLogin} />} />
              <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} user={user} />} />
              <Route path="/profile" element={<Profile user={user} onLogout={onLogout} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
}
