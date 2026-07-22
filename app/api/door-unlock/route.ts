import { NextRequest, NextResponse } from "next/server";
import { DOOR_COOKIE_NAME, checkPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const expected = process.env.DOOR_PASSWORD || "july2026";
  if (!checkPassword(password, expected)) {
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // No maxAge — a session cookie, so the door replays on the next browser session.
  res.cookies.set(DOOR_COOKIE_NAME, await signToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
