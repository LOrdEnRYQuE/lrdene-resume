import { MetadataRoute } from "next";

export const runtime = "edge";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { SERVICE_LOCATIONS } from "@/utils/serviceLocations";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import {
  TOPIC_CLUSTER_CONTENT_KEY,
  getAllTopicClusterPaths,
  resolveTopicClusters,
} from "@/lib/seo/topicClusters";

function localizePath(path: string, locale: string) {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function toLocalizedEntries(
  baseUrl: string,
  entries: Array<Omit<MetadataRoute.Sitemap[number], "url"> & { path: string }>,
): MetadataRoute.Sitemap {
  return entries.flatMap((entry) =>
    SUPPORTED_LOCALES.map((locale) => ({
      ...entry,
      url: `${baseUrl}${localizePath(entry.path, locale)}`,
    })),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lordenryque.com";

  const [posts, projects, services, demos, topicClusterContent] = await Promise.all([
    fetchQuery(api.posts.list, { onlyPublished: true }),
    fetchQuery(api.projects.list, { category: undefined }),
    fetchQuery(api.services.list, {}),
    fetchQuery(api.demos.list, {}),
    fetchQuery(api.pages.getPageContent, { key: TOPIC_CLUSTER_CONTENT_KEY, fallbackToEnglish: true }),
  ]);
  const topicClusters = resolveTopicClusters(topicClusterContent?.data);

  const postEntries = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectEntries = projects.map((project) => ({
    path: `/projects/${project.slug}`,
    lastModified: new Date(project._creationTime),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const serviceEntries = services.map((service) => ({
    path: `/services/${service.slug}`,
    lastModified: new Date(service._creationTime),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const serviceLocationEntries = services.flatMap((service) =>
    SERVICE_LOCATIONS.map((location) => ({
      path: `/services/${service.slug}-${location.slug}`,
      lastModified: new Date(service._creationTime),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  const demoEntries = demos.map((demo) => ({
    path: `/demos/${demo.slug}`,
    lastModified: new Date(demo._creationTime),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const insightClusterEntries = topicClusters.map((cluster) => ({
    path: `/insights/${cluster.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const insightTopicEntries = getAllTopicClusterPaths(topicClusters).map((entry) => ({
    path: entry.path,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    { path: "/", lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { path: "/about", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/blog", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/insights", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/projects", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/services", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/qr-solutions", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/demos", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/contact", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.8 },
    { path: "/privacy", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/terms", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/imprint", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/cookies", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
  ];

  return toLocalizedEntries(baseUrl, [
    ...staticRoutes,
    ...serviceEntries,
    ...serviceLocationEntries,
    ...demoEntries,
    ...insightClusterEntries,
    ...insightTopicEntries,
    ...postEntries,
    ...projectEntries,
  ]);
}
