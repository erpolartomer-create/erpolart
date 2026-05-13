import { supabase } from '../config/supabase.js';

// @desc    Get site content
// @route   GET /api/content/:siteId
// @access  Public
export const getContent = async (req, res) => {
  try {
    const { data: content, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('site_id', req.params.siteId)
      .single();

    if (error || !content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upsert site content (Create or Update)
// @route   PUT /api/content/:siteId
// @access  Private (Only Site Owner)
export const updateContent = async (req, res) => {
  const { title, description, images } = req.body;
  const currentUserId = req.user.uid || req.user.id;

  try {
    // 1. Verify Site Ownership (Relational check in Supabase)
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('user_id')
      .eq('id', req.params.siteId)
      .single();

    if (siteError || !site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    if (site.user_id !== currentUserId) {
      return res.status(403).json({ message: 'Not authorized to update this site' });
    }

    // 2. Perform Upsert
    const { data: content, error: upsertError } = await supabase
      .from('site_content')
      .upsert({
        site_id: req.params.siteId,
        title,
        description,
        images,
        updated_at: new Date()
      }, { onConflict: 'site_id' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
