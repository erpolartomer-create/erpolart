import { supabase } from '../config/supabase.js';

// @desc    Create new site
// @route   POST /api/sites
// @access  Private (Authenticated User)
export const createSite = async (req, res) => {
  const { templateId, domain } = req.body;
  const currentUserId = req.user.uid || req.user.id;

  try {
    const { data: site, error } = await supabase
      .from('sites')
      .insert([{
        user_id: currentUserId,
        template_id: Number(templateId),
        domain
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(site);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current user's sites
// @route   GET /api/sites
// @access  Private (Authenticated User)
export const getMySites = async (req, res) => {
  const currentUserId = req.user.uid || req.user.id;

  try {
    const { data: sites, error } = await supabase
      .from('sites')
      .select(`
        *,
        templates (*)
      `)
      .eq('user_id', currentUserId);

    if (error) throw error;
    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
