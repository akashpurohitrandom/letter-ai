import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, isValidToken } from "./lib/auth";

// The letters section and the admin (write) page are password-gated.
// Only the homepage (background + Spotify + the LETTERS CTA) is public.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!(await isValidToken(token))) {
    const url = req.nextUrl.clone();
    url.pathname = "/unlock";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/letters",
    "/letters/:path*",
    "/admin",
    "/admin/:path*",
    "/api/letters",
    "/api/letters/:path*",
  ],
};
