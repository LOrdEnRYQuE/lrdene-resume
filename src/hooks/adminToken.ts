"use client";

type CachedToken = { token: string; exp: number };

let cachedAdminToken: CachedToken | null = null;

function decodeTokenExp(token: string) {
  try {
    const [payload] = token.split(".");
    if (!payload) return 0;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (payload.length % 4 || 4)) % 4);
    const binary = atob(base64);
    const json = JSON.parse(binary) as { exp?: number };
    return json.exp ?? 0;
  } catch {
    return 0;
  }
}

export function clearCachedAdminToken() {
  cachedAdminToken = null;
}

export async function fetchAdminToken() {
  const now = Date.now();
  if (cachedAdminToken && cachedAdminToken.exp > now + 15_000) {
    return cachedAdminToken.token;
  }

  const response = await fetch("/api/admin/convex-token", {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || "Unable to fetch admin token.");
  }

  const payload = (await response.json()) as { token?: string };
  if (!payload.token) {
    throw new Error("Missing admin token.");
  }

  cachedAdminToken = {
    token: payload.token,
    exp: decodeTokenExp(payload.token),
  };
  return cachedAdminToken.token;
}
