import { supabase } from '../config/supabase.js';
import sendEmail from '../utils/sendEmail.js';
import { contactReplyEmail, adminNewLeadEmail } from '../templates/notifyEmails.js';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'hello@erpolart.com';
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Metin alanlarını kırp ve uzunlukla sınırla (null/undefined → null)
const clean = (v, max) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
};

// @desc    Submit message from contact form
// @route   POST /api/messages
// @access  Public
export const submitMessage = async (req, res) => {
  const name         = clean(req.body?.name, 120);
  const email        = clean(req.body?.email, 254);
  const service_type = clean(req.body?.service_type, 60);
  const budget       = clean(req.body?.budget, 60);
  const timeline     = clean(req.body?.timeline, 60);
  const message      = clean(req.body?.message, 4000);
  const lang         = ['tr', 'en', 'de'].includes(String(req.body?.lang || '').slice(0, 2)) ? String(req.body.lang).slice(0, 2) : 'tr';

  // Sunucu tarafı doğrulama — istemci `required` yeterli değil
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Ad, e-posta ve mesaj zorunludur.' });
  }
  if (!EMAIL_RX.test(email)) {
    return res.status(400).json({ message: 'Geçersiz e-posta adresi.' });
  }

  try {
    const { data: newMessage, error } = await supabase
      .from('leads')
      .insert([{
        name,
        email,
        service_type,
        budget,
        timeline,
        message,
        project_code: 'erpolart', // istemciden alınmaz
      }])
      .select('id, created_at')
      .single();

    if (error) throw error;

    // Müşteriye çok dilli otomatik yanıt + admin'e bildirim (engellemez).
    // Şablonlar kullanıcı alanlarını HTML-kaçışlı gömer.
    try {
      const reply = contactReplyEmail({ lang, name });
      await sendEmail({ email, subject: reply.subject, html: reply.html });
    } catch (e) { console.error('[CONTACT REPLY EMAIL ERROR]', e?.message); }
    try {
      const note = adminNewLeadEmail({ name, email, service: service_type, message });
      await sendEmail({ email: ADMIN_EMAIL, subject: note.subject, html: note.html });
    } catch (e) { console.error('[ADMIN LEAD EMAIL ERROR]', e?.message); }

    res.status(201).json({ success: true, id: newMessage?.id });
  } catch (error) {
    console.error('[SUBMIT MESSAGE ERROR]', error?.message);
    res.status(400).json({ message: 'Mesaj kaydedilemedi.' });
  }
};

// @desc    Get site messages
// @route   GET /api/messages/:siteId
// @access  Private (Admin Only — route seviyesinde korunur)
export const getMyMessages = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('project_code', siteId || 'erpolart')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('[GET MESSAGES ERROR]', error?.message);
    res.status(500).json({ message: 'Mesajlar alınamadı.' });
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
    console.error('[GET ALL MESSAGES ERROR]', error?.message);
    res.status(500).json({ message: 'Mesajlar alınamadı.' });
  }
};
