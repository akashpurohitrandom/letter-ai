import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, DOOR_COOKIE_NAME, isValidToken } from "./lib/auth";

// /main (the clock/Spotify/LETTERS experience) sits behind the door page ("/")
// via a session-only cookie — closing the browser means the door replays.
// /letters and /admin sit behind the separate, persistent LETTERS password.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/main")) {
    const doorToken = req.cookies.get(DOOR_COOKIE_NAME)?.value;
    if (!(await isValidToken(doorToken, process.env.DOOR_PASSWORD || "july2026"))) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!(await isValidToken(token, process.env.SITE_PASSWORD || ""))) {
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
    "/main",
    "/main/:path*",
  ],
};
