const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

type AdminSessionPayload = {
  u: string;
  exp: number;
};

function toBase64Url(bytes: Uint8Array) {
  const binary = String.fromCharCode(...bytes);
  const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4 || 4)) % 4);
  const binary = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("binary");
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(value: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toBase64Url(new Uint8Array(sig));
}

async function verify(value: string, signature: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify("HMAC", key, fromBase64Url(signature), enc.encode(value));
}

function parseCookieHeader(cookieHeader: string | null, key: string) {
  if (!cookieHeader) return undefined;
  const segments = cookieHeader.split(";").map((segment) => segment.trim());
  for (const segment of segments) {
    if (!segment.startsWith(`${key}=`)) continue;
    try {
      return decodeURIComponent(segment.slice(key.length + 1));
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function getAdminCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !sessionSecret) return null;
  return { username, password, sessionSecret };
}

export async function createAdminSessionToken(username: string, sessionSecret: string) {
  return createAdminSessionTokenWithTtl(username, sessionSecret, ADMIN_SESSION_TTL_MS);
}

export async function createAdminSessionTokenWithTtl(
  username: string,
  sessionSecret: string,
  ttlMs: number,
) {
  const payload: AdminSessionPayload = {
    u: username,
    exp: Date.now() + ttlMs,
  };
  const payloadEncoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(payloadEncoded, sessionSecret);
  return `${payloadEncoded}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  sessionSecret: string,
  expectedUsername?: string,
) {
  if (!token) return false;
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return false;
  const isValidSignature = await verify(payloadEncoded, signature, sessionSecret);
  if (!isValidSignature) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadEncoded))) as AdminSessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return false;
    if (expectedUsername && payload.u !== expectedUsername) return false;
    return true;
  } catch {
    return false;
  }
}

export function readAdminTokenFromCookieHeader(cookieHeader: string | null) {
  return parseCookieHeader(cookieHeader, ADMIN_SESSION_COOKIE);
}
