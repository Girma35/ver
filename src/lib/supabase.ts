import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The app is a one-user demo: every cloud row is keyed by this id.
export const DEMO_PROFILE_ID = 'demo-user';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

const looksLikePlaceholder = (value: string) =>
  value.length === 0 || /^(my|your|placeholder|changeme)/i.test(value);

/** True only when real credentials are present, so the app can run fully offline without them. */
export const isSupabaseConfigured =
  !looksLikePlaceholder(supabaseUrl) &&
  !looksLikePlaceholder(supabaseAnonKey) &&
  supabaseUrl.startsWith('http');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
