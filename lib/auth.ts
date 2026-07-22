export const AUTH_COOKIE_NAME = "letters_auth";
export const DOOR_COOKIE_NAME = "door_auth";

function getSecret() {
  return process.env.AUTH_SECRET || "fallback-dev-secret-change-me";
}

// Uses Web Crypto (available in both the Node.js and Edge runtimes) instead of
// Node's 'crypto' module, so this works inside Next.js middleware.
async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Produces a deterministic signature for the correct password.
// The cookie stores this signature — never the raw password.
export async function signToken(password: string) {
  return hmacSha256Hex(getSecret(), password);
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function isValidToken(token: string | undefined | null, expectedPassword: string) {
  if (!token) return false;
  const expected = await signToken(expectedPassword);
  return constantTimeEqual(token, expected);
}

export function checkPassword(password: string, expectedPassword: string) {
  return password === expectedPassword;
}
