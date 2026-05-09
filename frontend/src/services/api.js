// Central API service — all backend calls go through here
const API_BASE = 'http://localhost:5000/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let errMsg = `API Error ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.error) errMsg = errData.error;
    } catch (e) { }
    throw new Error(errMsg);
  }
  return res.json();
}

// Health
export const getHealth = () => apiFetch('/health');

// Products
export const getProducts = (category) =>
  apiFetch(`/products${category && category !== 'All' ? `?category=${category}` : ''}`);
export const createProduct = (data) => apiFetch('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id, data) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id) => apiFetch(`/products/${id}`, { method: 'DELETE' });
export const seedProducts = () => apiFetch('/products/seed', { method: 'POST' });

// Orders
export const getOrders = () => apiFetch('/orders');
export const createOrder = (data) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
export const updateOrder = (id, status) => apiFetch(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteOrder = (id) => apiFetch(`/orders/${id}`, { method: 'DELETE' });

// Users
export const getUsers = () => apiFetch('/users');
export const deleteUser = (id) => apiFetch(`/users/${id}`, { method: 'DELETE' });

// Auth
export const login = (email, password) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

// Admin
export const getAdminStats = () => apiFetch('/admin/stats');
