import { cookies } from 'next/headers';
import { createServerClient as createClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is missing. Set it in Vercel env vars and/or apps/web/.env.local`
    );
  }
  return value;
}

/**
 * Server-side Supabase client for authenticated requests
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Admin client with service role key (use sparingly, only in API routes)
 */
export function createAdminClient() {
  const SERVICE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY', supabaseServiceKey);
  // For admin client, use the regular createClient from @supabase/supabase-js
  // SSR package doesn't have admin client support
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  return createSupabaseClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
    SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
