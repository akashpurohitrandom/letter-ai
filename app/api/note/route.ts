import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, isValidToken } from "@/lib/auth";

// GET is public — the sticky note is shown on the open landing page.
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from("sticky_note").select("*").eq("id", 1).maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST is used by /admin. That page itself isn't cookie-gated by middleware in
// the same way /letters is, so we check the auth cookie here directly.
export async function POST(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!(await isValidToken(token, process.env.SITE_PASSWORD || ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();
  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("sticky_note")
    .upsert({ id: 1, message: message.trim(), updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
