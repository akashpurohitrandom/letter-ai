import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type Message = { text: string; sent_at: string };

type ChatRow = {
  id: number;
  messages: Message[];
  total_count: number;
};

const MAX_MESSAGES = 5;

const DEFAULT_ROW = {
  id: 1,
  messages: [] as Message[],
  total_count: 0,
};

async function getOrCreateRow(db: ReturnType<typeof supabaseAdmin>): Promise<ChatRow> {
  const { data } = await db.from("chat_box").select("*").eq("id", 1).maybeSingle();
  if (data) return data as ChatRow;

  const { data: created, error } = await db.from("chat_box").insert(DEFAULT_ROW).select().single();
  if (error) throw new Error(error.message);
  return created as ChatRow;
}

export async function GET() {
  const db = supabaseAdmin();
  try {
    const row = await getOrCreateRow(db);
    return NextResponse.json(row);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
    }
    if (text.length > 500) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    const row = await getOrCreateRow(db);
    const messages = [...row.messages, { text: text.trim(), sent_at: new Date().toISOString() }].slice(
      -MAX_MESSAGES
    );

    const { data, error } = await db
      .from("chat_box")
      .update({
        messages,
        total_count: row.total_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
