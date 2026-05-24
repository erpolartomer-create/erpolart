import translate from 'google-translate-api-next';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { SYSTEM_PROMPT } from '../config/systemPrompt.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * @desc    Translate text to multiple languages
 */
export const translateText = async (req, res) => {
  try {
    const { text, targetLanguages } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required for translation' });
    }

    if (!targetLanguages || !Array.isArray(targetLanguages)) {
      return res.status(400).json({ message: 'targetLanguages must be an array (e.g., ["en", "de"])' });
    }

    const results = {};

    await Promise.all(
      targetLanguages.map(async (lang) => {
        try {
          const res = await translate(text, { to: lang });
          results[lang] = res.text;
        } catch (err) {
          console.error(`Translation to ${lang} failed:`, err.message);
          results[lang] = '';
        }
      })
    );

    res.status(200).json({ translations: results });
  } catch (error) {
    console.error(`[TRANSLATION ERROR] ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error during translation' });
  }
};

/**
 * Supabase'den aktif template'leri çek ve bot için formatla
 */
const fetchTemplatesForAI = async () => {
  const { data, error } = await supabase
    .from('templates')
    .select('id, name, category, price, tier, is_sold, features, short_pitch, demo_url')
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[TEMPLATE FETCH ERROR]', error.message);
    return 'Şu an şablon verisi yüklenemiyor.';
  }

  if (!data || data.length === 0) return 'Henüz aktif şablon bulunmuyor.';

  const tierNames = { 1: 'Corporate', 2: 'Pro', 3: 'Premium', 4: 'Platinum' };
  const monthlyFees = { Corporate: 29, Pro: 49, Premium: 150, Platinum: 250 };

  const formatted = data.map((t) => {
    const sold = t.is_sold
      ? 'SATILDI — Bu mimari artık satışta değil.'
      : 'MEVCUT — Tek seferlik satılır, satın alındığında katalogdan kalkar.';

    let pitch = '';
    if (typeof t.short_pitch === 'object' && t.short_pitch !== null) {
      pitch = t.short_pitch.tr || t.short_pitch.en || '';
    } else {
      pitch = t.short_pitch || '';
    }

    const tierName = tierNames[t.tier] || t.tier;
    const monthlyFee = monthlyFees[tierName] ?? 'N/A';

    return `
--- ${t.name} ---
Kategori: ${t.category}
Fiyat: $${t.price}
Seviye: ${tierName}
Aylık Sistem Yönetimi: $${monthlyFee}/ay
Durum: ${sold}
Tanıtım: ${pitch}
Detay Sayfası: /templates/${t.id}
    `.trim();
  }).join('\n\n');

  return formatted;
};

// Lead Kayıt Yardımcısı (Supabase)
const saveLead = async (leadData) => {
  try {
    // 1. Chat geçmişine sistem mesajı olarak işaretle (admin chat'te görünsün)
    await supabase.from('chat_messages').insert([{
      session_id: leadData.sessionId,
      user_id: leadData.userId || null,
      role: 'system',
      content: `[LEAD CAPTURED - ${leadData.type}] ${leadData.message}`,
      project_code: 'erpolart'
    }]);

    // 2. Leads tablosuna da yaz (admin panelde ve Supabase'de doğrudan görünsün)
    const emailRx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRx = /(\+?\d[\d\s\-().]{7,})/;

    const extractedEmail = emailRx.exec(leadData.message)?.[0] || null;
    const extractedPhone = phoneRx.exec(leadData.message)?.[0]?.trim() || null;

    await supabase.from('leads').insert([{
      name: 'Chat Lead',
      email: extractedEmail,
      phone: extractedPhone,
      message: `[Chatbot – ${leadData.type}] ${leadData.message} | session: ${leadData.sessionId}`,
      service_type: 'chat',
      project_code: 'erpolart',
    }]);

    console.log(`[LEAD] ${leadData.type} captured → leads tablosuna yazıldı`);
  } catch (err) {
    console.error('[LEAD SAVE ERROR]', err.message);
  }
};

/**
 * @desc    Chat with Gemini AI
 * @route   POST /api/ai/chat
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message, userContext, history, sessionId, userId } = req.body;
    const io = req.app.get('io');
    const mutedSessions = req.app.get('mutedSessions');

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    // 0. MESAJI VERİTABANINA KAYDET (Temiz kullanıcı mesajı — context etiketi olmadan)
    try {
      await supabase.from('chat_messages').insert([{
        session_id: sessionId,
        user_id: userId || null,
        role: 'user',
        content: message
      }]);

      // Admin odasına yeni mesaj bilgisini uçur
      if (io) {
        io.to('admin_room').emit('new_message', {
          sessionId,
          userId,
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (dbErr) {
      console.error('[DB SAVE ERROR - USER]', dbErr.message);
    }

    // 1. BOT SUSTURULMUŞ MU KONTROLÜ
    console.log(`[MUTE CHECK] sessionId: ${sessionId}, mutedSessions: [${[...mutedSessions]}], isMuted: ${mutedSessions.has(sessionId)}`);
    if (mutedSessions.has(sessionId)) {
      console.log(`[MUTED] Bot muted for session ${sessionId}. Skipping AI.`);
      return res.status(200).json({ text: null, muted: true });
    }

    // 2. LEAD TESPİTİ (Mevcut mantık korunuyor)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const channelKeywords = ['whatsapp', 'telefon', 'email', 'e-posta', 'ara', 'ulaş'];

    const hasEmail = emailRegex.test(message);
    const hasPhone = phoneRegex.test(message);
    const hasKeyword = channelKeywords.some(k => message.toLowerCase().includes(k));

    if (hasEmail || hasPhone || (message.length < 50 && hasKeyword)) {
      const leadInfo = {
        sessionId: sessionId,
        userId: userId || null,
        message: message,
        type: hasEmail ? 'Email' : hasPhone ? 'Phone' : 'Channel Preference'
      };
      saveLead(leadInfo);
      if (io) {
        io.to('admin_room').emit('new_lead_alert', leadInfo);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Sistem Hatası: API anahtarı eksik." });
    }

    // GOOGLE_API_KEY env var'ını temizle — kütüphane onu override olarak kullanıyor
    delete process.env.GOOGLE_API_KEY;
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // 1.5 TEMPLATE BİLGİLERİNİ ÇEK VE PROMPT'A EKLE
    const templatesContext = await fetchTemplatesForAI();
    
    // userContext'i system prompt'a ekle (mesaj gövdesine DEĞİL — AI tekrarlıyordu)
    const userAuthInfo = userContext ? `\n\nKULLANICI DURUMU: ${userContext.trim()}. Bu bilgiyi asla mesajlarında gösterme veya tekrarlama.` : '';
    const enrichedSystemPrompt = SYSTEM_PROMPT +
      "\n\nMEVCUT DİJİTAL MİMARİLER (TEMPLATE KATALOĞU):\n" + templatesContext +
      "\n\nÖNEMLİ: Müşteri bir şablon hakkında soru sorarsa, yukarıdaki teknik detayları ve fiyatları baz alarak net bilgi ver." +
      userAuthInfo;

    const formattedContents = (history || []).map(item => ({
      role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(item.parts) ? item.parts : [{ text: String(item.content || item.text || " ") }]
    }));

    // Temiz kullanıcı mesajını ekle (context etiketi system prompt'ta)
    formattedContents.push({
      role: 'user',
      parts: [{ text: String(message || " ") }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: enrichedSystemPrompt,
        maxOutputTokens: 1500,
        temperature: 0.7,
      }
    });

    // Boş/undefined response kontrolü
    const aiText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || 'Anlıyorum. Size daha iyi yardımcı olabilmem için iletişim bilgilerinizi bırakabilir misiniz?';

    // 3. ASİSTAN CEVABINI VERİTABANINA KAYDET
    try {
      await supabase.from('chat_messages').insert([{
        session_id: sessionId,
        user_id: userId || null,
        role: 'assistant',
        content: aiText
      }]);

      if (io) {
        io.to('admin_room').emit('new_message', {
          sessionId,
          role: 'assistant',
          content: aiText,
          timestamp: new Date().toISOString()
        });
      }
    } catch (dbErr) {
      console.error('[DB SAVE ERROR - AI]', dbErr.message);
    }

    res.status(200).json({ text: aiText });

  } catch (error) {
    console.error("═══════════════════════════════════════");
    console.error("[GEMINI ERROR]", error?.message || error);
    console.error("[GEMINI STATUS]", error?.status || error?.response?.status || 'N/A');
    console.error("[GEMINI DETAILS]", JSON.stringify(error?.errorDetails || error?.response?.data || {}, null, 2));
    console.error("═══════════════════════════════════════");
    const fallbackMessage = "Şu an sistemlerimizde yoğunluk yaşanıyor. Projenizi detaylandırmak için lütfen telefon numaranızı veya e-posta adresinizi bırakın, ekibimiz size anında dönüş yapsın.";
    res.status(200).json({ text: fallbackMessage });
  }
};