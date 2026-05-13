import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createTable() {
  console.log('🔧 Creating chat_messages table...\n');

  const sql = `
    CREATE TABLE IF NOT EXISTS public.chat_messages (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      session_id TEXT NOT NULL,
      user_id UUID DEFAULT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'admin')),
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      project_code TEXT DEFAULT 'erpolart'
    );

    CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'chat_select_own') THEN
        CREATE POLICY "chat_select_own" ON public.chat_messages FOR SELECT TO anon, authenticated
        USING (true);
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'chat_insert_any') THEN
        CREATE POLICY "chat_insert_any" ON public.chat_messages FOR INSERT TO anon, authenticated
        WITH CHECK (true);
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'chat_service_full') THEN
        CREATE POLICY "chat_service_full" ON public.chat_messages FOR ALL TO service_role
        USING (true) WITH CHECK (true);
      END IF;
    END $$;
  `;

  // Supabase SQL endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    },
    body: JSON.stringify({})
  });

  // Since we can't run raw SQL via REST, try the pg_net approach or direct SQL API
  // Let's use the Supabase Management SQL endpoint instead
  const sqlRes = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  });

  if (!sqlRes.ok) {
    console.log('⚠️  Direct SQL endpoint not available. Trying alternative...\n');
    
    // Alternative: Try inserting a test row - if table doesn't exist, we know we need manual creation
    const { error: testError } = await supabase.from('chat_messages').select('id').limit(1);
    
    if (testError && testError.code === 'PGRST205') {
      console.log('❌ Table does not exist. Please run the following SQL in Supabase Dashboard → SQL Editor:\n');
      console.log('='.repeat(80));
      console.log(sql);
      console.log('='.repeat(80));
      console.log('\n📌 Go to: https://supabase.com/dashboard → Your Project → SQL Editor → Paste & Run');
      process.exit(1);
    } else {
      console.log('✅ Table already exists!');
    }
  } else {
    console.log('✅ Table created successfully!');
  }

  // Verify
  const { data, error } = await supabase.from('chat_messages').select('id').limit(1);
  if (error) {
    console.log('\n❌ Verification failed:', error.message);
  } else {
    console.log('✅ Verification passed. Table is ready.');
  }
}

createTable().catch(console.error);
