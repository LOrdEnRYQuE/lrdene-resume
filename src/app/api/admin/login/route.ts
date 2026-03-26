import { NextResponse } from "next/server";
import { createAdminSessionToken, getAdminCookieName, getAdminCredentials } from "@/lib/adminAuth";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX_ATTEMPTS = 6;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS_BY_USERNAME = 10;

function getClientIp(request: Request) {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("forwarded");
  if (forwarded) {
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }
  return "unknown";
}

function safeEqual(a: string, b: string) {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i += 1) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

export async function POST(request: Request) {
  const creds = getAdminCredentials();
  if (!creds) {
    return NextResponse.json(
      { error: "Admin credentials are not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET." },
      { status: 500 },
    );
  }

  let payload: { username?: string; password?: string };
  try {
    payload = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = (payload.username ?? "").trim();
  const password = (payload.password ?? "").trim();
  const normalizedUsername = username.toLowerCase() || "unknown";
  const ipRateKey = `admin-login:ip:${getClientIp(request)}`;
  const usernameRateKey = `admin-login:user:${normalizedUsername}`;
  const now = Date.now();
  const [ipLimitState, usernameLimitState] = await Promise.all([
    fetchQuery(api.adminRateLimit.getStatus, {
      fingerprint: ipRateKey,
      now,
    }),
    fetchQuery(api.adminRateLimit.getStatus, {
      fingerprint: usernameRateKey,
      now,
    }),
  ]);
  if (ipLimitState.limited || usernameLimitState.limited) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Try again later.",
        retryAfterMs: Math.max(ipLimitState.retryAfterMs, usernameLimitState.retryAfterMs),
      },
      { status: 429 },
    );
  }

  const expectedUsername = creds.username.trim();
  const expectedPassword = creds.password.trim();
  const validCreds =
    safeEqual(username.toLowerCase(), expectedUsername.toLowerCase()) &&
    safeEqual(password, expectedPassword);
  if (!validCreds) {
    const [ipFailureState, usernameFailureState] = await Promise.all([
      fetchMutation(api.adminRateLimit.registerFailure, {
        fingerprint: ipRateKey,
        now,
        windowMs: RATE_LIMIT_WINDOW_MS,
        maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
      }),
      fetchMutation(api.adminRateLimit.registerFailure, {
        fingerprint: usernameRateKey,
        now,
        windowMs: RATE_LIMIT_WINDOW_MS,
        maxAttempts: RATE_LIMIT_MAX_ATTEMPTS_BY_USERNAME,
      }),
    ]);
    if (ipFailureState.limited || usernameFailureState.limited) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Try again later.",
          retryAfterMs: Math.max(ipFailureState.retryAfterMs, usernameFailureState.retryAfterMs),
        },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await Promise.all([
    fetchMutation(api.adminRateLimit.clear, {
      fingerprint: ipRateKey,
      now,
    }),
    fetchMutation(api.adminRateLimit.clear, {
      fingerprint: usernameRateKey,
      now,
    }),
  ]);
  const token = await createAdminSessionToken(creds.username, creds.sessionSecret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
