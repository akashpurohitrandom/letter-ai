import { createClient } from "@supabase/supabase-js";

// Next.js patches global fetch to cache requests by default. Some supabase-js
// query shapes (e.g. adding .order()) produce a request signature that Next
// ends up caching indefinitely even with dynamic = "force-dynamic", which
// would freeze the letters list at whatever it returned on first load. Force
// every Supabase request to bypass that cache.
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

// Public client (safe for reads of published letters)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { fetch: noStoreFetch } }
);

// Admin client (server-only, uses the service role key — bypasses row-level security)
// Only ever import this inside API routes / server code, never in client components.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false }, global: { fetch: noStoreFetch } }
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
