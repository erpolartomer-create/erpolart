import { supabase } from '../config/supabase.js';

const ADMIN_EMAIL = 'hello@erpolart.com';

// JWT payload'ını oku (imza supabase.auth.getUser ile ZATEN doğrulanmış token için kullanılır)
const jwtClaims = (token) => {
  try { return JSON.parse(Buffer.from(String(token).split('.')[1], 'base64url').toString('utf8')); }
  catch { return {}; }
};

// Tek admin kuralı — tüm admin kontrolleri (HTTP, DB proxy, Socket.io) bunu kullanır.
// GÜVENLİK: user_metadata kullanıcının yazabildiği alandır → asla kullanılmaz.
// ADMIN_REQUIRE_MFA=1 ise admin oturumu iki aşamalı doğrulanmış (aal2) olmalıdır.
export const isAdminUser = (user, token) => {
  if (!user) return false;
  const isAdmin = user.email === ADMIN_EMAIL || user.app_metadata?.role === 'admin';
  if (!isAdmin) return false;
  if (process.env.ADMIN_REQUIRE_MFA === '1' && jwtClaims(token).aal !== 'aal2') return false;
  return true;
};

// Müşteri Rotası Koruması (Supabase Auth Entegrasyonu)
export const customerProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ message: 'Not authorized, customer session failed' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, session error' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin Rotası Koruması (Supabase Auth Entegrasyonu)
export const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        console.warn("[AUTH DEBUG] Supabase Auth User Fetch Failed:", error?.message);
        return res.status(401).json({ message: 'Not authorized, admin session failed (User not found)' });
      }

      if (!isAdminUser(user, token)) {
        console.warn("[AUTH DEBUG] Authorization Denied for:", user.email);
        return res.status(403).json({ message: 'Not authorized, admin privileges required' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("[AUTH DEBUG] Admin Auth Middleware Critical Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, admin session error' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no admin token' });
  }
};

// Aliases
export const protect = customerProtect;
export const adminOnly = adminProtect;
