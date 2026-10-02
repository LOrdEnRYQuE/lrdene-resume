type ShopifySessionClaims = {
  dest?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  sub?: string;
};

const encoder = new TextEncoder();
const DEFAULT_SHOPIFY_SHOP_DOMAIN = "m11xd1-pq.myshopify.com";

function expectedShopDomain(): string {
  return (process.env.SHOPIFY_SHOP_DOMAIN ?? DEFAULT_SHOPIFY_SHOP_DOMAIN)
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

export function isExpectedShopDomain(value: string): boolean {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "").toLowerCase() === expectedShopDomain();
}

function base64ToBytes(input: string): Uint8Array {
  const raw = atob(input);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return base64ToBytes(padded);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let raw = "";
  for (const byte of bytes) raw += String.fromCharCode(byte);
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }
  return diff === 0;
}

async function hmacSha256(secret: string, value: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return new Uint8Array(signature);
}

export async function verifyShopifySessionToken(token: string): Promise<ShopifySessionClaims> {
  const secret = process.env.SHOPIFY_API_SECRET;
  const clientId = process.env.SHOPIFY_API_KEY;
  if (!secret || !clientId) throw new Error("Shopify app credentials are not configured");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid Shopify session token");

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = JSON.parse(
    new TextDecoder().decode(base64UrlToBytes(encodedHeader)),
  ) as { alg?: string; typ?: string };

  if (header.alg !== "HS256") throw new Error("Unsupported Shopify session token algorithm");

  const expected = await hmacSha256(secret, `${encodedHeader}.${encodedPayload}`);
  const actual = base64UrlToBytes(encodedSignature);
  if (!timingSafeEqual(expected, actual)) throw new Error("Invalid Shopify session token signature");

  const claims = JSON.parse(
    new TextDecoder().decode(base64UrlToBytes(encodedPayload)),
  ) as ShopifySessionClaims;

  const now = Math.floor(Date.now() / 1000);
  const skew = 30;
  if (typeof claims.exp !== "number" || claims.exp < now - skew) {
    throw new Error("Expired Shopify session token");
  }
  if (typeof claims.nbf === "number" && claims.nbf > now + skew) {
    throw new Error("Shopify session token is not active yet");
  }

  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(clientId)) throw new Error("Invalid Shopify session token audience");

  if (!claims.dest || !isExpectedShopDomain(claims.dest)) {
    throw new Error("Invalid Shopify session token destination");
  }

  if (!claims.sub?.startsWith("gid://shopify/Customer/")) {
    throw new Error("Authenticated Shopify customer is required");
  }

  return claims;
}

export async function verifyShopifyWebhook(
  rawBody: string,
  signatureHeader: string,
): Promise<boolean> {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) throw new Error("SHOPIFY_API_SECRET is not configured");

  const expected = await hmacSha256(secret, rawBody);
  let actual: Uint8Array;
  try {
    actual = base64ToBytes(signatureHeader);
  } catch {
    return false;
  }
  return timingSafeEqual(expected, actual);
}

export async function createSmartPublicCode(seed: string): Promise<string> {
  const secret = process.env.SMART_LINK_SECRET ?? process.env.SHOPIFY_API_SECRET;
  if (!secret) throw new Error("SMART_LINK_SECRET or SHOPIFY_API_SECRET is required");

  const digest = await hmacSha256(secret, seed);
  return bytesToBase64Url(digest).slice(0, 12);
}
