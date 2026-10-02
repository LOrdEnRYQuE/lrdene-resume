import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicCode: string }> },
) {
  const { publicCode } = await params;
  const url = new URL(request.url);
  url.pathname = `/card/${encodeURIComponent(publicCode)}`;
  url.search = "";
  return NextResponse.redirect(url, 307);
}
