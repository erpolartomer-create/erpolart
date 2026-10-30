import express from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../config/supabase.js';
import sendEmail from '../utils/sendEmail.js';
import { statusUpdateEmail } from '../templates/notifyEmails.js';
import { isAdminUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin sipariş durumunu değiştirince müşteriye bilgi maili (çok dilli).
const notifyOrderStatus = async (order, status) => {
  let productName = 'Dijital Mimari';
  if (order.template_id) {
    const { data: tpl } = await supabase.from('templates').select('name').eq('id', order.template_id).single();
    if (tpl?.name) productName = tpl.name;
  }
  const mail = statusUpdateEmail({
    lang: order.lang || 'tr',
    status,
    orderId: String(order.id || '').slice(0, 8).toUpperCase(),
    productName,
  });
  await sendEmail({ email: order.email, subject: mail.subject, html: mail.html });
};

const dbLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

// Lead (form) yazımları için ayrı, daha sıkı limit — /api/messages ile aynı seviye.
const leadsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

router.use(dbLimiter);

// ───────────────────────────── Yardımcılar ─────────────────────────────

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const COLUMN_RX = /^[a-z_][a-z0-9_]*$/;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Admin olmayan istemcilerin kullanabileceği ilişki gömmeleri (tablo → izinli ilişki adları).
// PostgREST `select` içinde `rel(...)` / `alias:rel(...)` ile başka tablolar okunabilir;
// yalnızca aşağıdakilere izin verilir, geri kalan her `(` reddedilir.
const ALLOWED_EMBEDS = {
  orders: ['templates'],
};

// `select` dizgesini doğrula: düz kolon listesi veya izinli gömmeler.
const validateSelect = (table, select) => {
  if (typeof select !== 'string' || select.length > 400) return false;
  let rest = select;
  const allowed = ALLOWED_EMBEDS[table] || [];
  for (const rel of allowed) {
    // "templates(...)" veya "templates:template_id(...)" — iç kısım yalnızca düz kolonlar
    const rx = new RegExp(`${rel}(?::[a-z_][a-z0-9_]*)?\\(([a-z0-9_,\\s*]*)\\)`, 'g');
    rest = rest.replace(rx, '');
  }
  return /^[a-z0-9_,\s*]*$/i.test(rest);
};

// `or` filtre dizgesi: yalnızca basit `col.op.value` zinciri; gömme/alt sorgu yok.
const validateOrFilter = (value) =>
  typeof value === 'string' && value.length <= 300 && /^[a-zA-Z0-9_.,@+\-]+$/.test(value) && !value.includes('(');

const validateFilters = (filters) => {
  if (!Array.isArray(filters) || filters.length > 10) return false;
  for (const f of filters) {
    if (!isPlainObject(f)) return false;
    if (f.type === 'eq') {
      if (typeof f.column !== 'string' || !COLUMN_RX.test(f.column)) return false;
      if (!['string', 'number', 'boolean'].includes(typeof f.value)) return false;
      if (typeof f.value === 'string' && f.value.length > 300) return false;
    } else if (f.type === 'or') {
      if (!validateOrFilter(f.value)) return false;
    } else {
      return false;
    }
  }
  return true;
};

const findIdFilter = (filters) => filters.find((f) => f.type === 'eq' && f.column === 'id');
const hasValidUuidId = (filters) => {
  const f = findIdFilter(filters);
  return !!(f && typeof f.value === 'string' && UUID_RX.test(f.value));
};

// Gövdeyi beyaz listeye indir ve metin alanlarını kırp/sınırla.
const pickFields = (body, allowed, maxLen = 2000) => {
  const out = {};
  for (const key of allowed) {
    if (body[key] === undefined) continue;
    const v = body[key];
    if (typeof v === 'string') out[key] = v.slice(0, maxLen);
    else if (v === null || typeof v === 'number' || typeof v === 'boolean' || isPlainObject(v) || Array.isArray(v)) out[key] = v;
  }
  return out;
};

// Admin olmayanın orders üzerinde güncelleyebileceği alanlar (kişiselleştirme formu / workspace).
// edit_count istemciden alınmaz; aşağıda sunucu tarafından artırılır.
const ORDER_PATCH_FIELDS = [
  'brand_name', 'brand_colors', 'logo_url', 'project_notes', 'addon_configs', 'siteData',
];
// Bu alanlardan biri değişirse bir revizyon hakkı harcanır (OrderSuccessPage MAX_REVISIONS ile aynı)
const REVISION_FIELDS = ['brand_name', 'brand_colors', 'logo_url', 'project_notes', 'addon_configs'];
const MAX_REVISIONS = 5;

// Admin olmayan hiç kimseye dönmeyen dahili alanlar
const ORDER_INTERNAL_FIELDS = ['admin_notes', 'iyzico_payment_id'];
// Sipariş sahibi olmayan (guest siparişi ID ile açan) istemciye dönmeyen kişisel veriler
const ORDER_PII_FIELDS = ['email', 'full_name', 'customer_phone', 'phone', 'address', 'tax_id', 'company', 'user_id'];

// logo_url yalnızca kendi Storage bucket'ımızdan olabilir (admin panelde <img> ile açılıyor)
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const isOwnLogoUrl = (v) => v === null || (typeof v === 'string' && v.startsWith(`${SUPABASE_URL}/storage/v1/object/public/logos/orders/`) && v.length < 600);

const sanitizeOrderRows = (data, user) => {
  const clean = (row) => {
    if (!row || typeof row !== 'object') return row;
    const out = { ...row };
    for (const k of ORDER_INTERNAL_FIELDS) delete out[k];
    const isOwner = user && row.user_id && row.user_id === user.id;
    if (!isOwner) for (const k of ORDER_PII_FIELDS) delete out[k];
    return out;
  };
  return Array.isArray(data) ? data.map(clean) : clean(data);
};

const LEAD_FIELDS = ['name', 'email', 'phone', 'company', 'message', 'service_type', 'budget', 'timeline', 'project_code'];

// Helper function to extract user and check if they are admin
const getRequestUser = async (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        return { user, isAdmin: isAdminUser(user, token) };
      }
    } catch (err) {
      console.error('[dbRoutes] Token verification failed:', err.message);
    }
  }
  return { user: null, isAdmin: false };
};

const deny = (res, msg = 'Access denied') => res.status(403).json({ error: msg });

// ───────────────────────────── Proxy ucu ─────────────────────────────

// Lead yazımları (form spam) için daha sıkı limit — yalnızca leads/POST isteklerinde devreye girer
const leadsWriteLimiter = (req, res, next) =>
  (req.params.table === 'leads' && req.body?.method === 'POST') ? leadsLimiter(req, res, next) : next();

router.post('/:table/query', leadsWriteLimiter, async (req, res) => {
  const { table } = req.params;
  if (!isPlainObject(req.body)) return res.status(400).json({ error: 'Bad request' });

  const {
    method = 'GET',
    select = '*',
    selectOpts = {},
    filters = [],
    order = null,
    single = false,
  } = req.body;
  let body = req.body.body ?? null;

  try {
    if (!COLUMN_RX.test(table)) return res.status(400).json({ error: 'Bad request' });
    if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(method)) return res.status(400).json({ error: 'Bad request' });
    if (!validateFilters(filters)) return res.status(400).json({ error: 'Bad request' });
    if (order !== null && (!isPlainObject(order) || !COLUMN_RX.test(String(order.column || '')))) {
      return res.status(400).json({ error: 'Bad request' });
    }
    if (!isPlainObject(selectOpts)) return res.status(400).json({ error: 'Bad request' });

    // 1. Kimlik bağlamı
    const { user, isAdmin } = await getRequestUser(req);

    // 2. Admin olmayanlar için tablo/rol kuralları
    if (!isAdmin) {
      // select yalnızca düz kolon listesi + izinli gömme; selectOpts yalnızca count/head
      if (!validateSelect(table, select)) return deny(res, 'Access denied: invalid select');
      for (const k of Object.keys(selectOpts)) {
        if (!['count', 'head'].includes(k)) return deny(res, 'Access denied: invalid select options');
      }
      // Yazma gövdesi dizi olamaz (dizi gövde alan temizliğini atlatıyordu)
      if ((method === 'POST' || method === 'PATCH') && !isPlainObject(body)) {
        return res.status(400).json({ error: 'Bad request' });
      }

      if (table === 'templates') {
        // Herkes okur, kimse yazamaz
        if (method !== 'GET') return deny(res, 'Access denied: Admin only');
      }
      else if (table === 'leads') {
        // Herkes lead ekler (iletişim/teklif formları); okuma/düzenleme yok
        if (method !== 'POST') return deny(res, 'Access denied: Admin only');
        body = pickFields(body, LEAD_FIELDS, 4000);
        if (body.email !== undefined && body.email !== null && !EMAIL_RX.test(String(body.email))) {
          return res.status(400).json({ error: 'Invalid email' });
        }
        if (!body.message && !body.email) return res.status(400).json({ error: 'Bad request' });
        body.project_code = 'erpolart';
      }
      else if (table === 'proposals') {
        // Yalnızca tam ID ile tek teklif okunur (link paylaşımı); listeleme yok
        if (method !== 'GET') return deny(res, 'Access denied: Admin only');
        if (!hasValidUuidId(filters)) return deny(res, 'Access denied: Must query by specific proposal ID');
      }
      else if (table === 'orders') {
        if (method === 'GET') {
          if (hasValidUuidId(filters)) {
            // Gizli UUID ile tek sipariş — guest siparişler için gerekli; sahiplik ayrıca
            // frontend'de gösterilir. Sahipli siparişi başkası okuyamasın:
            // (user_id dolu ve istek sahibi değilse reddet)
            const idFilter = findIdFilter(filters);
            const { data: own } = await supabase.from('orders').select('user_id').eq('id', idFilter.value).single();
            if (own?.user_id && (!user || own.user_id !== user.id)) return deny(res, 'Access denied: Order does not belong to you');
          } else if (user) {
            // Listeleme: yalnızca kendi siparişleri (or filtresi varsa AND ile daraltılır)
            filters.push({ type: 'eq', column: 'user_id', value: user.id });
          } else {
            return deny(res, 'Access denied: Unauthenticated users can only query specific orders by ID');
          }
        }
        else if (method === 'POST') {
          // Sipariş oluşturma yalnızca /api/orders (kimlikli, tutar sunucuda hesaplı) üzerinden.
          // Proxy ile sipariş eklemek (ve amount/status göndermek) kapalı.
          return deny(res, 'Access denied: Use /api/orders');
        }
        else if (method === 'PATCH') {
          if (!hasValidUuidId(filters)) return deny(res, 'Access denied: Must update by specific order ID');
          const idFilter = findIdFilter(filters);
          const { data: checkOrder } = await supabase
            .from('orders')
            .select('user_id, edit_count')
            .eq('id', idFilter.value)
            .single();
          if (!checkOrder) return deny(res, 'Access denied: Order not found');
          // Guest sipariş (user_id=null): ID'ye sahip olan düzenler; sahipli: yalnızca sahibi.
          if (checkOrder.user_id && (!user || checkOrder.user_id !== user.id)) {
            return deny(res, 'Access denied: Order does not belong to you');
          }
          // Yalnızca kişiselleştirme alanları (beyaz liste) — status/amount/user_id/email/edit_count asla
          body = pickFields(body, ORDER_PATCH_FIELDS);
          if (Object.keys(body).length === 0) return res.status(400).json({ error: 'Bad request' });
          if ('logo_url' in body && !isOwnLogoUrl(body.logo_url)) return res.status(400).json({ error: 'Invalid logo_url' });
          // Revizyon hakkı sunucuda sayılır; istemci sayacı sıfırlayamaz
          if (REVISION_FIELDS.some((k) => k in body)) {
            const current = Number(checkOrder.edit_count || 0);
            if (current >= MAX_REVISIONS) return deny(res, 'Revision limit reached');
            body.edit_count = current + 1;
          }
          // PATCH filtresi yalnızca id (+ project_code) olabilir
          if (filters.some((f) => !['id', 'project_code'].includes(f.column))) return deny(res);
        }
        else {
          return deny(res, 'Access denied: Admin only');
        }
      }
      else if (table === 'chat_messages') {
        // Yalnızca okuma; yazma backend (/api/ai/chat) ve admin tarafından yapılır.
        if (method !== 'GET') return deny(res, 'Access denied: Admin only');
        const sessionFilter = filters.find((f) => f.type === 'eq' && f.column === 'session_id');
        if (!sessionFilter || typeof sessionFilter.value !== 'string' || !sessionFilter.value) {
          return deny(res, 'Access denied: Must query by specific session_id');
        }
        // user_<uuid> oturumları yalnızca o kullanıcıya (anonim dahil herkes için zorunlu)
        if (sessionFilter.value.startsWith('user_')) {
          if (!user || sessionFilter.value !== `user_${user.id}`) return deny(res, 'Access denied: Session ID mismatch');
        }
        if (filters.some((f) => f.type === 'or')) return deny(res);
      }
      else {
        // Diğer tüm tablolar yalnızca admin
        return deny(res, 'Access denied: Admin only');
      }
    }

    // 3. Sorguyu service-role istemcisiyle çalıştır
    let query = supabase.from(table);

    if (method === 'GET') {
      query = query.select(select, selectOpts);
      for (const f of filters) {
        if (f.type === 'eq') query = query.eq(f.column, f.value);
        else if (f.type === 'or') query = query.or(f.value);
      }
      if (order) query = query.order(order.column, { ascending: order.ascending !== false });
      if (single) query = query.single();
    }
    else if (method === 'POST') {
      query = query.insert(body);
      query = single ? query.select().single() : query.select();
    }
    else if (method === 'PATCH') {
      query = query.update(body);
      for (const f of filters) {
        if (f.type === 'eq') query = query.eq(f.column, f.value);
      }
      query = single ? query.select().single() : query.select();
    }
    else if (method === 'DELETE') {
      query = query.delete();
      for (const f of filters) {
        if (f.type === 'eq') query = query.eq(f.column, f.value);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error(`[dbRoutes] Supabase error on table ${table}:`, error.message);
      return res.status(400).json({ error: 'Bad request' }); // şema detaylarını gizle
    }

    // Admin sipariş durumunu müşteri-yönlü bir aşamaya çekince → müşteriye bilgi maili
    if (table === 'orders' && method === 'PATCH' && isAdmin && body && ['active', 'revision', 'development'].includes(body.status)) {
      const updated = Array.isArray(data) ? data[0] : data;
      if (updated?.email) {
        notifyOrderStatus(updated, body.status).catch((e) => console.error('[STATUS EMAIL ERROR]', e?.message));
      }
    }

    // Admin olmayanlara sipariş satırlarında dahili alan / başkasının kişisel verisi dönmez
    const out = (!isAdmin && table === 'orders') ? sanitizeOrderRows(data, user) : data;
    return res.json({ data: out, count });

  } catch (err) {
    console.error(`[dbRoutes] Unexpected error on table ${table}:`, err.message);
    if (!res.headersSent) return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
