import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

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
          // Customers can only see their own orders. Guests can only see a single order by ID.
          if (user) {
            // Force filter to customer's user_id
            const existingUserFilterIdx = filters.findIndex(f => f.column === 'user_id');
            if (existingUserFilterIdx !== -1) {
              filters[existingUserFilterIdx] = { type: 'eq', column: 'user_id', value: user.id };
            } else {
              filters.push({ type: 'eq', column: 'user_id', value: user.id });
            }
          } else {
            // Guest: must query single order by ID
            const idFilter = filters.find(f => f.column === 'id' && f.type === 'eq');
            if (!idFilter || !idFilter.value) {
              return res.status(403).json({ error: 'Access denied: Unauthenticated users can only query specific orders by ID' });
            }
          }
        } 
        else if (method === 'POST') {
          // Force user_id field for insertion
          if (user) {
            body.user_id = user.id;
          } else {
            body.user_id = null;
          }
          // Block anon from setting status to anything other than awaiting_transfer
          if (!user && body.status && body.status !== 'awaiting_transfer') {
            body.status = 'awaiting_transfer';
          }
        } 
        else if (method === 'PATCH') {
          // Customers can only update their own orders. Guests can only update by specific ID.
          if (user) {
            // Ensure target order belongs to user
            const idFilter = filters.find(f => f.column === 'id' && f.type === 'eq');
            if (!idFilter) {
              return res.status(403).json({ error: 'Access denied: Must update by specific order ID' });
            }
            // Verify ownership first
            const { data: checkOrder } = await supabase
              .from('orders')
              .select('user_id')
              .eq('id', idFilter.value)
              .single();
            if (!checkOrder || checkOrder.user_id !== user.id) {
              return res.status(403).json({ error: 'Access denied: Order does not belong to you' });
            }
          } else {
            // Guest: only allow updating hosted options / metadata on their own order ID
            const idFilter = filters.find(f => f.column === 'id' && f.type === 'eq');
            if (!idFilter) {
              return res.status(403).json({ error: 'Access denied: Must specify order ID' });
            }
            // Block updating protected fields like amount, status, email, user_id
            delete body.amount;
            delete body.status;
            delete body.email;
            delete body.user_id;
          }
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
