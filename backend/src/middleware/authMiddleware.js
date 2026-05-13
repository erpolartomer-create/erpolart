import { supabase } from '../config/supabase.js';

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

      const ADMIN_EMAIL = 'hello@erpolart.com';
      const isAdmin =
        user.email === ADMIN_EMAIL ||
        user.app_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'admin';

      if (!isAdmin) {
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
