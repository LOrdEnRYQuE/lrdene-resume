import { v } from "convex/values";

const ADMIN_TOKEN = v.string();

type AdminSessionPayload = {
  u: string;
  exp: number;
};

function decodePayload(token: string): AdminSessionPayload {
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) {
    throw new Error("Invalid admin token.");
  }

  try {
    return JSON.parse(new TextDecoder().decode(fromBase64Url(payloadEncoded))) as AdminSessionPayload;
  } catch {
    throw new Error("Invalid admin token payload.");
  }
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4 || 4)) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function requireAdminToken(token: string) {
  const username = process.env.ADMIN_USERNAME;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !sessionSecret) {
    throw new Error("Admin auth is not configured in Convex environment.");
  }

  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) {
    throw new Error("Invalid admin token.");
  }

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(sessionSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const validSig = await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), enc.encode(payloadEncoded));
  if (!validSig) {
    throw new Error("Invalid admin token signature.");
  }

  const payload = decodePayload(token);

  if (!payload.exp || payload.exp < Date.now()) {
    throw new Error("Admin token expired.");
  }
  if (payload.u !== username) {
    throw new Error("Invalid admin token user.");
  }
}

export async function getAdminUsernameFromToken(token: string) {
  await requireAdminToken(token);
  const payload = decodePayload(token);
  return payload.u;
}

export { ADMIN_TOKEN };
