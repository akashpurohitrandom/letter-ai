import { createClient } from "@supabase/supabase-js";

// Public client (safe for reads of published letters)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client (server-only, uses the service role key — bypasses row-level security)
// Only ever import this inside API routes / server code, never in client components.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export type Letter = {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
};
