import { unstable_cache } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import type { Locale } from "@/lib/i18n/config";

export const getPageContentCached = unstable_cache(
  async (key: string, locale: Locale, fallbackToEnglish: boolean) =>
    fetchQuery(api.pages.getPageContent, { key, locale, fallbackToEnglish }),
  ["page-content"],
  { revalidate: 60, tags: ["cms:pages"] },
);

export const getSiteSettingsCached = unstable_cache(
  async () => fetchQuery(api.settings.get, {}),
  ["site-settings"],
  { revalidate: 60, tags: ["cms:settings"] },
);

export const getFeaturedProjectsCached = unstable_cache(
  async () => fetchQuery(api.projects.getFeatured, {}),
  ["featured-projects"],
  { revalidate: 120, tags: ["projects"] },
);

export const getPublishedPostsCached = unstable_cache(
  async () => fetchQuery(api.posts.list, { onlyPublished: true }),
  ["published-posts"],
  { revalidate: 120, tags: ["posts"] },
);
