import { supabase } from '../config/supabase.js';

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
  if (!Number.isInteger(templateId)) return res.status(400).json({ message: 'Invalid template id' });
  try {
    // req.user customerProtect ile doğrulandı; service-role istemcisinde auth.getUser() oturumsuz çalışmaz.
    const favorites = Array.isArray(req.user.user_metadata?.favorites) ? req.user.user_metadata.favorites : [];

    const newFavorites = favorites.includes(templateId)
      ? favorites.filter(id => id !== templateId)
      : [...favorites, templateId].slice(0, 100);

    const { error } = await supabase.auth.admin.updateUserById(req.user.id, {
      user_metadata: { ...req.user.user_metadata, favorites: newFavorites },
    });

    if (error) throw error;
    res.json({ favorites: newFavorites });
  } catch (error) {
    console.error('[TOGGLE FAVORITE ERROR]', error?.message);
    res.status(500).json({ message: 'Favori güncellenemedi.' });
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
