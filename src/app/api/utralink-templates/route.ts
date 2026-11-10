import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const response = await fetch("https://utralink.com/api/public/template-gallery", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Template gallery unavailable");
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid template gallery");
    const templates = data.filter((item): item is Record<string, unknown> =>
      item !== null && typeof item === "object" && !Array.isArray(item)
      && typeof (item as Record<string, unknown>).id === "number"
      && typeof (item as Record<string, unknown>).name === "string"
    ).map((item) => ({
      id: item.id,
      name: item.name,
      type: typeof item.type === "string" ? item.type : "other",
      screenshot_url: typeof item.screenshot_url === "string" ? item.screenshot_url : null,
      preview_url: typeof item.preview_url === "string" && /^https:\/\/utralink\.com\//.test(item.preview_url) ? item.preview_url : null,
    }));
    return NextResponse.json(templates);
  } catch {
    return NextResponse.json({ error: "Catalog temporarily unavailable" }, { status: 503 });
  }
}
