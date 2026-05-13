import { supabase } from '../config/supabase.js';

// Helper to determine if a string is a valid UUID
const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('project_code', 'erpolart')
      .order('template_id', { ascending: true });

    if (error) {
      console.error(`[SUPABASE ERROR] ${error.message}`);
      return res.status(200).json([]);
    }
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error(`[GET ALL TEMPLATES ERROR] ${error.message}`);
    res.status(200).json([]);
  }
};

// @desc    Get single template by id
// @route   GET /api/templates/:id
// @access  Public
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    let query = supabase.from('templates').select('*');

    if (isUUID(id)) {
      query = query.eq('id', id);
    } else if (!isNaN(id)) {
      query = query.eq('template_id', Number(id));
    } else {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ message: 'Template not found' });
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`[CRITICAL ERROR] Error in getTemplateById:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Helper to ensure tech_stack and features are real arrays for Supabase/PostgreSQL
const sanitizeTemplatePayload = (body, isUpdate = false) => {
  const payload = { ...body };

  // Map camelCase to snake_case for DB alignment
  if (body.imageUrl) payload.image_url = body.imageUrl;
  if (body.demoUrl) payload.demo_url = body.demoUrl;
  if (body.projectCode) payload.project_code = body.projectCode;
  if (body.templateId) payload.template_id = Number(body.templateId);

  // Map description (from short_pitch)
  if (body.short_pitch) payload.description = body.short_pitch;
  else if (body.shortPitch) payload.description = body.shortPitch;

  // Strict Project Code Enforcement
  payload.project_code = 'erpolart';

  // Handle tech_stack
  if (payload.tech_stack) {
    if (typeof payload.tech_stack === 'string') {
      payload.tech_stack = payload.tech_stack.split(',').map(s => s.trim()).filter(Boolean);
    }
  } else if (payload.techStack) {
    payload.tech_stack = typeof payload.techStack === 'string' 
      ? payload.techStack.split(',').map(s => s.trim()).filter(Boolean)
      : payload.techStack;
  } else if (!isUpdate) {
    payload.tech_stack = [];
  }

  // Handle features
  if (payload.features) {
    if (typeof payload.features === 'string') {
      payload.features = payload.features.split(',').map(s => s.trim()).filter(Boolean);
    }
  } else if (!isUpdate) {
    payload.features = [];
  }

  // Remove camelCase versions and legacy keys to avoid Supabase unknown column errors
  const keysToRemove = [
    'imageUrl', 'demoUrl', 'projectCode', 'templateId', 
    'techStack', 'previewImage', 'longDescription', 
    'shortPitch', 'short_pitch_old' // Keep short_pitch if it exists in DB
  ];
  
  keysToRemove.forEach(key => delete payload[key]);

  return payload;
};

// @desc    Create a template
// @route   POST /api/templates
// @access  Admin
export const createTemplate = async (req, res) => {
  try {
    const payload = sanitizeTemplatePayload(req.body);

    const { data, error } = await supabase
      .from('templates')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("[SUPABASE INSERT ERROR]", error);
      throw error;
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a template
// @route   PUT /api/templates/:id
// @access  Admin
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = sanitizeTemplatePayload(req.body, true);

    let query = supabase.from('templates').update(payload);

    if (isUUID(id)) {
      query = query.eq('id', id);
    } else if (!isNaN(id)) {
      query = query.eq('template_id', Number(id));
    } else {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { data, error } = await query.select().single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ message: 'Template not found' });
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`Update Template Error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a template
// @route   DELETE /api/templates/:id
// @access  Admin
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    let query = supabase.from('templates').delete();

    if (isUUID(id)) {
      query = query.eq('id', id);
    } else if (!isNaN(id)) {
      query = query.eq('template_id', Number(id));
    } else {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { error } = await query;

    if (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        return res.status(400).json({ message: 'Bu şablon aktif siparişlerle ilişkili olduğu için silinemez. Silmek yerine yayından kaldırmayı deneyin.' });
      }
      throw error;
    }
    
    res.status(200).json({ message: 'Template deleted' });
  } catch (error) {
    console.error(`Delete Template Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
