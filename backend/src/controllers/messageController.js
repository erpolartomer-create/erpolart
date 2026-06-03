import { supabase } from '../config/supabase.js';
import sendEmail from '../utils/sendEmail.js';
import { contactReplyEmail, adminNewLeadEmail } from '../templates/notifyEmails.js';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'hello@erpolart.com';

// @desc    Submit message from contact form
// @route   POST /api/messages
// @access  Public
export const submitMessage = async (req, res) => {
  // Formdan gelen tüm yeni alanları body'den alıyoruz
  const { name, email, service_type, budget, timeline, message, project_code, lang } = req.body;

  try {
    const { data: newMessage, error } = await supabase
      .from('leads') // Tablo adını 'leads' olarak netleştirdik
      .insert([{
        name,
        email,
        service_type,
        budget,
        timeline,
        message,
        project_code: project_code || 'erpolart'
      }])
      .select()
      .single();

    if (error) throw error;

    // Müşteriye çok dilli otomatik yanıt + admin'e bildirim (engellemez).
    if (email) {
      try {
        const reply = contactReplyEmail({ lang, name });
        await sendEmail({ email, subject: reply.subject, html: reply.html });
      } catch (e) { console.error('[CONTACT REPLY EMAIL ERROR]', e?.message); }
    }
    try {
      const note = adminNewLeadEmail({ name, email, service: service_type, message });
      await sendEmail({ email: ADMIN_EMAIL, subject: note.subject, html: note.html });
    } catch (e) { console.error('[ADMIN LEAD EMAIL ERROR]', e?.message); }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get site messages
// @route   GET /api/messages/:siteId
// @access  Private (Site Owner Only)
export const getMyMessages = async (req, res) => {
  try {
    const { siteId } = req.params;
    const currentUserId = req.user.uid || req.user.id;

    // Verify ownership indirectly or via join if needed
    // For now, simple fetch
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('project_code', siteId || 'erpolart')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages (Admin)
// @route   GET /api/messages
// @access  Private (Admin Only)
export const getAllMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
