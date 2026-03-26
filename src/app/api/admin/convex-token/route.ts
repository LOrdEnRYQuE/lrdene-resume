import { NextResponse } from "next/server";
import {
  createAdminSessionTokenWithTtl,
  getAdminCredentials,
  readAdminTokenFromCookieHeader,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

export const runtime = "edge";
export const dynamic = "force-dynamic";
const CONVEX_TOKEN_TTL_MS = 1000 * 60 * 3;

async function ensureAdmin(request: Request) {
  const creds = getAdminCredentials();
  if (!creds) {
    return { error: NextResponse.json({ error: "Admin auth is not configured." }, { status: 500 }) };
  }
  const token = readAdminTokenFromCookieHeader(request.headers.get("cookie"));
  const valid = await verifyAdminSessionToken(token, creds.sessionSecret, creds.username);
  if (!valid) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { creds };
}

export async function GET(request: Request) {
  const auth = await ensureAdmin(request);
  if ("error" in auth) {
    return auth.error;
  }

  const token = await createAdminSessionTokenWithTtl(
    auth.creds.username,
    auth.creds.sessionSecret,
    CONVEX_TOKEN_TTL_MS,
  );
  return NextResponse.json(
    { token },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
}
