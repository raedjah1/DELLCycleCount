// ============================================================================
// SUPABASE CLIENT - Browser-side Supabase client
// ============================================================================
// Location: /lib/supabase/client.ts
// Purpose: Create Supabase client for use in Client Components

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
