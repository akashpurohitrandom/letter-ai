import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("letters")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { title, content } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("letters")
    .update({ title, content })
    .eq("slug", params.slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const db = supabaseAdmin();
  const { error } = await db.from("letters").delete().eq("slug", params.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
