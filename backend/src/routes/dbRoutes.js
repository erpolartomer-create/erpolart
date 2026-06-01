import express from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../config/supabase.js';

const router = express.Router();

const dbLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

router.use(dbLimiter);

// Helper function to extract user and check if they are admin
const getRequestUser = async (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        const ADMIN_EMAIL = 'hello@erpolart.com';
        const isAdmin =
          user.email === ADMIN_EMAIL ||
          user.app_metadata?.role === 'admin' ||
          user.user_metadata?.role === 'admin';
        return { user, isAdmin };
      }
    } catch (err) {
      console.error("[dbRoutes] Token verification failed:", err.message);
    }
  }
  return { user: null, isAdmin: false };
};

// Database Proxy Query Route
router.post('/:table/query', async (req, res) => {
  const { table } = req.params;
  const { method = 'GET', select = '*', selectOpts = {}, filters = [], order = null, single = false, body = null } = req.body;

  try {
    // 1. Get user authentication context
    const { user, isAdmin } = await getRequestUser(req);

    // 2. Security validation based on table and role
    if (!isAdmin) {
      if (table === 'templates') {
        // Anyone can read templates, nobody else can write/edit/delete
        if (method !== 'GET') {
          return res.status(403).json({ error: 'Access denied: Admin only' });
        }
      } 
      else if (table === 'leads') {
        // Anyone can insert leads (contact form), nobody else can read/edit/delete
        if (method !== 'POST') {
          return res.status(403).json({ error: 'Access denied: Admin only' });
        }
      } 
      else if (table === 'proposals') {
        // Users can only fetch a single proposal by its exact ID (link sharing), no listing
        if (method !== 'GET') {
          return res.status(403).json({ error: 'Access denied: Admin only' });
        }
        const idFilter = filters.find(f => f.column === 'id' && f.type === 'eq');
        if (!idFilter || !idFilter.value) {
          return res.status(403).json({ error: 'Access denied: Must query by specific proposal ID' });
        }
      } 
      else if (table === 'orders') {
        if (method === 'GET') {
          // Belirli sipariş ID'siyle (gizli UUID) sorgu → herkese izin ver.
          // Siparişler guest (user_id=null) olarak oluşabildiği için giriş yapmış
          // kullanıcıya zorla user_id filtresi UYGULAMA — aksi halde kendi siparişini
          // ID ile çekemez (.single() 0 satır → 400). ID tahmin edilemez; order-success
          // bununla açılır, sahiplik gösterimini frontend yapar.
          const idFilter = filters.find(f => f.column === 'id' && f.type === 'eq');
          if (idFilter && idFilter.value) {
            // ID ile sorgu — user_id zorlaması yok
          } else if (user) {
            // Listeleme: sadece kullanıcının kendi siparişleri
            filters.push({ type: 'eq', column: 'user_id', value: user.id });
          } else {
            return res.status(403).json({ error: 'Access denied: Unauthenticated users can only query specific orders by ID' });
          }
        }
        else if (method === 'POST') {
          // Strip server-only financial fields — must come from edge functions, not client
          delete body.amount;
          delete body.monthly_fee;
          delete body.iyzico_payment_id;
          delete body.paid_at;
          // Force user_id field for insertion
          if (user) {
            body.user_id = user.id;
          } else {
            body.user_id = null;
          }
          // Block anon from setting status to anything other than the initial
          // 'pending' state — ödeme onayı (paid) yalnızca PayTR callback'inden gelir.
          if (!user && body.status && body.status !== 'pending') {
            body.status = 'pending';
          }
        } 
        else if (method === 'PATCH') {
          // Sipariş ID'si (gizli UUID) zorunlu.
          const idFilter = filters.find(f => f.column === 'id' && f.type === 'eq');
          if (!idFilter || !idFilter.value) {
            return res.status(403).json({ error: 'Access denied: Must update by specific order ID' });
          }
          // Sahiplik: guest sipariş (user_id=null) ise ID'ye sahip olan düzenleyebilir;
          // sahipli sipariş ise sadece sahibi düzenleyebilir.
          const { data: checkOrder } = await supabase
            .from('orders')
            .select('user_id')
            .eq('id', idFilter.value)
            .single();
          if (!checkOrder) {
            return res.status(403).json({ error: 'Access denied: Order not found' });
          }
          if (checkOrder.user_id && (!user || checkOrder.user_id !== user.id)) {
            return res.status(403).json({ error: 'Access denied: Order does not belong to you' });
          }
          // Sunucu-only / finansal alanları her durumda koru
          delete body.amount;
          delete body.status;
          delete body.paid_at;
          delete body.iyzico_payment_id;
          delete body.user_id;
          delete body.template_id;
          delete body.email;
        } 
        else {
          return res.status(403).json({ error: 'Access denied: Admin only' });
        }
      } 
      else if (table === 'chat_messages') {
        if (method === 'GET') {
          // Force filter on session_id
          const sessionFilter = filters.find(f => f.column === 'session_id' && f.type === 'eq');
          if (!sessionFilter || !sessionFilter.value) {
            return res.status(403).json({ error: 'Access denied: Must query by specific session_id' });
          }
          // If authenticated, also verify user matches if session is a user session
          if (user && sessionFilter.value.startsWith('user_')) {
            if (sessionFilter.value !== `user_${user.id}`) {
              return res.status(403).json({ error: 'Access denied: Session ID mismatch' });
            }
          }
        } 
        else if (method === 'POST') {
          // Check session_id matches user if user is authenticated
          if (user && body.session_id !== `user_${user.id}`) {
            return res.status(403).json({ error: 'Access denied: Session ID mismatch' });
          }
        } 
        else {
          return res.status(403).json({ error: 'Access denied: Admin only' });
        }
      } 
      else {
        // Any other table (like dm1_appointments, etc.) are strictly admin only
        return res.status(403).json({ error: 'Access denied: Admin only' });
      }
    }

    // 3. Construct and run query on Supabase using service role client
    let query = supabase.from(table);

    if (method === 'GET') {
      query = query.select(select, selectOpts);
      for (const f of filters) {
        if (f.type === 'eq') {
          query = query.eq(f.column, f.value);
        } else if (f.type === 'or') {
          query = query.or(f.value);
        }
      }
      if (order) {
        query = query.order(order.column, { ascending: order.ascending });
      }
      if (single) {
        query = query.single();
      }
    } 
    else if (method === 'POST') {
      query = query.insert(body);
      if (single) {
        query = query.select().single();
      } else {
        query = query.select();
      }
    } 
    else if (method === 'PATCH') {
      query = query.update(body);
      for (const f of filters) {
        if (f.type === 'eq') {
          query = query.eq(f.column, f.value);
        }
      }
      if (single) {
        query = query.select().single();
      } else {
        query = query.select();
      }
    } 
    else if (method === 'DELETE') {
      query = query.delete();
      for (const f of filters) {
        if (f.type === 'eq') {
          query = query.eq(f.column, f.value);
        }
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error(`[dbRoutes] Supabase error on table ${table}:`, error.message);
      return res.status(400).json({ error: 'Bad request' }); // generic error to hide schema details
    }

    return res.json({ data, count });

  } catch (err) {
    console.error(`[dbRoutes] Unexpected error on table ${table}:`, err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
