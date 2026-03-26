import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import type { Metadata } from "next";

export async function getPageMetadata(route: string): Promise<Metadata | null> {
  try {
    const data = await fetchQuery(api.siteMetadata.getByRoute, { route });
    if (!data) return null;

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords ? data.keywords.split(",").map(k => k.trim()) : undefined,
      openGraph: {
        title: data.title,
        description: data.description,
        images: data.ogImage ? [{ url: data.ogImage }] : undefined,
      }
    };
  } catch (error) {
    console.error(`Failed to fetch SEO for ${route}:`, error);
    return null;
  }
}
