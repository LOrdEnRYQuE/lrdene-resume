import { NextResponse } from "next/server";
import {
  createAdminSessionTokenWithTtl,
  getAdminCredentials,
  readAdminTokenFromCookieHeader,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 5;
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

function isAllowedExt(filename: string) {
  const dot = filename.lastIndexOf(".");
  const ext = dot >= 0 ? filename.slice(dot).toLowerCase() : "";
  return [".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".gif"].includes(ext);
}

async function ensureAdmin(request: Request) {
  const creds = getAdminCredentials();
  if (!creds) {
    return NextResponse.json({ error: "Admin auth is not configured." }, { status: 500 });
  }
  const token = readAdminTokenFromCookieHeader(request.headers.get("cookie"));
  const valid = await verifyAdminSessionToken(token, creds.sessionSecret, creds.username);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { creds };
}

async function createAdminToken(request: Request) {
  const auth = await ensureAdmin(request);
  if (auth instanceof NextResponse) {
    return { error: auth };
  }
  const token = await createAdminSessionTokenWithTtl(
    auth.creds.username,
    auth.creds.sessionSecret,
    ADMIN_TOKEN_TTL_MS,
  );
  return { token };
}

export async function GET(request: Request) {
  const auth = await createAdminToken(request);
  if ("error" in auth) return auth.error;

  try {
    const media = await fetchQuery(api.media.getMedia, {});
    const assets = (media ?? [])
      .map((item) => item.url)
      .filter((url): url is string => typeof url === "string" && url.length > 0)
      .sort((a, b) => (a < b ? 1 : -1));
    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to list assets", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await createAdminToken(request);
  if ("error" in auth) return auth.error;

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large (max 6MB)" }, { status: 400 });
    }

    if (!isAllowedExt(file.name)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const uploadUrl = await fetchMutation(api.media.generateUploadUrl, {
      adminToken: auth.token,
    });
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });
    if (!uploadResponse.ok) {
      return NextResponse.json({ error: "Upload failed" }, { status: 502 });
    }

    const uploadPayload = (await uploadResponse.json()) as { storageId?: string };
    if (!uploadPayload.storageId) {
      return NextResponse.json({ error: "Upload failed" }, { status: 502 });
    }

    const mediaId = await fetchMutation(api.media.saveMedia, {
      adminToken: auth.token,
      storageId: uploadPayload.storageId as Id<"_storage">,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    });
    const media = await fetchQuery(api.media.getMedia, {});
    const record = (media ?? []).find((item) => item._id === mediaId);
    const asset = record?.url ?? null;

    return NextResponse.json({ asset });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed", detail: String(error) }, { status: 500 });
  }
}
