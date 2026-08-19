import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Public, read-only client (anon key). Safe to use from server components.
// Falls back to a placeholder URL when unconfigured so the client can be
// constructed at module scope without throwing; callers must still check
// `isSupabaseConfigured` before issuing any request.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);

// Privileged client for /admin writes. Bypasses row level security, so it
// must only ever be constructed inside server code that sits behind the
// password gate — never imported into client components.
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Supabase is not configured: set SUPABASE_SERVICE_ROLE_KEY (and the NEXT_PUBLIC_SUPABASE_* vars) in .env.local"
    );
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
