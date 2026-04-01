import { MetadataRoute } from "next";

export const runtime = "edge";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import {
  TOPIC_CLUSTER_CONTENT_KEY,
  getAllTopicClusterPaths,
  resolveTopicClusters,
} from "@/lib/seo/topicClusters";

function toEntries(
  baseUrl: string,
  entries: Array<Omit<MetadataRoute.Sitemap[number], "url"> & { path: string }>,
): MetadataRoute.Sitemap {
  return entries.map((entry) => ({
    ...entry,
    url: `${baseUrl}${entry.path}`,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lordenryque.com";
  const staticLastModified = new Date("2026-03-27T00:00:00.000Z");

  let posts: Awaited<ReturnType<typeof fetchQuery<typeof api.posts.list>>> = [];
  let projects: Awaited<ReturnType<typeof fetchQuery<typeof api.projects.list>>> = [];
  let services: Awaited<ReturnType<typeof fetchQuery<typeof api.services.list>>> = [];
  let topicClusters: ReturnType<typeof resolveTopicClusters> = [];

  try {
    const [postsResult, projectsResult, servicesResult, topicClusterContent] = await Promise.all([
      fetchQuery(api.posts.list, { onlyPublished: true }),
      fetchQuery(api.projects.list, { category: undefined }),
      fetchQuery(api.services.list, {}),
      fetchQuery(api.pages.getPageContent, { key: TOPIC_CLUSTER_CONTENT_KEY, fallbackToEnglish: true }),
    ]);
    posts = postsResult;
    projects = projectsResult;
    services = servicesResult;
    topicClusters = resolveTopicClusters(topicClusterContent?.data);
  } catch {
    posts = [];
    projects = [];
    services = [];
    topicClusters = [];
  }

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

  const insightClusterEntries = topicClusters.map((cluster) => {
    const newestTopicUpdate = cluster.topics.reduce<number | null>((latest, topic) => {
      const time = Date.parse(topic.updatedAt);
      if (Number.isNaN(time)) return latest;
      return latest === null ? time : Math.max(latest, time);
    }, null);
    return {
      path: `/insights/${cluster.slug}`,
      lastModified: newestTopicUpdate ? new Date(newestTopicUpdate) : staticLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    };
  });

  const insightTopicEntries = getAllTopicClusterPaths(topicClusters).map((entry) => {
    const cluster = topicClusters.find((item) => item.slug === entry.cluster);
    const topic = cluster?.topics.find((item) => item.slug === entry.topic);
    const updatedAt = topic ? Date.parse(topic.updatedAt) : NaN;
    return {
      path: entry.path,
      lastModified: Number.isNaN(updatedAt) ? staticLastModified : new Date(updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  const staticRoutes = [
    { path: "/", lastModified: staticLastModified, changeFrequency: "daily" as const, priority: 1 },
    { path: "/about", lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/blog", lastModified: staticLastModified, changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/insights", lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/projects", lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/offers", lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.88 },
    { path: "/partners", lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services", lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/qr-solutions", lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/demos", lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/contact", lastModified: staticLastModified, changeFrequency: "yearly" as const, priority: 0.8 },
  ];

  return toEntries(baseUrl, [
    ...staticRoutes,
    ...serviceEntries,
    ...insightClusterEntries,
    ...insightTopicEntries,
    ...postEntries,
    ...projectEntries,
  ]);
}
