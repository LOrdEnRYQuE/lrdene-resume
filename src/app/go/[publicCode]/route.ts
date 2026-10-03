import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicCode: string }> },
) {
  const { publicCode } = await params;

  try {
    await fetchMutation(api.smartHub.recordPublicInteraction, {
      publicCode,
      type: "tap",
      referrer: request.headers.get("referer") ?? undefined,
    });
  } catch {
    // Analytics must never make a physical NFC/QR link fail.
  }

  const url = new URL(request.url);
  url.pathname = `/card/${encodeURIComponent(publicCode)}`;
  url.search = "";
  return NextResponse.redirect(url, 307);
}
