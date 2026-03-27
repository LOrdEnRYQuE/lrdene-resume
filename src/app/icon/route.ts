import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/icon.png";
  return NextResponse.redirect(url, 307);
}
