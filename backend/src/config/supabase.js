import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('CRITICAL: Supabase credentials missing in backend .env');
}

// Service role key is used for admin bypass of RLS
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
