import { supabase } from '../config/supabase.js';

// @desc    Register user (Compatibility layer)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw error;
    res.status(201).json({ success: true, user: data.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user (Compatibility layer)
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    res.json({
      id: data.user.id,
      email: data.user.email,
      token: data.session.access_token,
      metadata: data.user.user_metadata
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Admin Login Session
// @route   POST /api/auth/admin-login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Admin role check (Email based or metadata based)
    const isAdmin = data.user.email.includes('admin') || data.user.app_metadata?.role === 'admin';
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    res.json({
      id: data.user.id,
      email: data.user.email,
      token: data.session.access_token,
      metadata: data.user.user_metadata
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Redirect/Handle Email Verification
export const verifyEmail = async (req, res) => {
  // Supabase handles this via email links, but we keep the route for compatibility
  res.json({ message: 'Email verification is handled by Supabase security layer.' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  const templateId = Number(req.params.templateId);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const favorites = user.user_metadata?.favorites || [];

    let newFavorites;
    if (favorites.includes(templateId)) {
      newFavorites = favorites.filter(id => id !== templateId);
    } else {
      newFavorites = [...favorites, templateId];
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { favorites: newFavorites }
    });

    if (error) throw error;
    res.json({ favorites: newFavorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = req.user.user_metadata?.favorites || [];
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
