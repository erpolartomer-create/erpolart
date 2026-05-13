import axios from 'axios';
import { supabase } from '../lib/supabase';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Intercept requests to add Auth Token if exists - Separate Admin & User support
API.interceptors.request.use(async (req) => {
  let userInfo = null;

  try {
    const userData = localStorage.getItem('userInfo');
    if (userData) userInfo = JSON.parse(userData);
  } catch (e) {
    console.error('Error parsing auth info from localStorage:', e);
  }

  const url = req.url || '';
  const isOrderConfig = url.includes('/order-config');
  const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/admin-login');

  // ADMIN TOKEN INJECTION — use supabaseAdmin client (stores session in erpolart-admin-vault)
  if (!isOrderConfig && !isAuthRequest && (
    url.startsWith('/admin') || url.startsWith('admin') ||
    url.includes('auth/admin-me') ||
    ((url.startsWith('/templates') || url.startsWith('templates')) && req.method !== 'GET')
  )) {
    const { data: { session } } = await supabaseAdmin.auth.getSession();
    if (session?.access_token) {
      req.headers.Authorization = `Bearer ${session.access_token}`;
      return req;
    }
  }

  // CUSTOMER TOKEN INJECTION — always use fresh Supabase session
  if (userInfo) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      req.headers.Authorization = `Bearer ${session.access_token}`;
    } else if (userInfo.token) {
      req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }

  return req;
});

// Auth Endpoints
export const login = (formData) => API.post('/auth/login', formData);
export const adminLogin = (formData) => API.post('/auth/admin-login', formData); // NEW: Admin Login
export const register = (formData) => API.post('/auth/register', formData);
export const getMe = () => API.get('/auth/me');
export const getAdminMe = () => API.get('/auth/admin-me');

// Favorites
export const getFavorites = () => API.get('/auth/favorites');
export const toggleFavorite = (templateId) => API.post(`/auth/favorites/${templateId}`);

// Template & Site Endpoints
export const getTemplates = () => API.get('/templates');
export const getTemplateById = (templateId) => API.get(`/templates/${templateId}`);
export const getMySites = () => API.get('/sites');
export const createSite = (siteData) => API.post('/sites', siteData);
export const createOrder = (orderData) => API.post('/orders', orderData);

// Content Management
export const getContent = (siteId) => API.get(`/content/${siteId}`);
export const updateContent = (siteId, contentData) => API.put(`/content/${siteId}`, contentData);

// Order Configuration
export const getOrderConfig = (orderId) => API.get(`/templates/order-config/${orderId}`);
export const updateOrderConfig = (configData) => API.post('/templates/order-config', configData);

// Admin Orders
export const getAllOrders = () => API.get('/admin/orders');

// Messages
export const sendMessage = (messageData) => API.post('/messages', messageData);

export default API;
