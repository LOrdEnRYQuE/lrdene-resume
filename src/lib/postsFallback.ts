export type FallbackPost = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  readTime: string;
  date: number;
  tags?: string[];
};

const now = Date.now();

export const FALLBACK_POSTS: FallbackPost[] = [
  {
    _id: "fallback-post-web-dev-vs-graphic-design",
    title: "Web Developer vs Graphic Designer: What Your Business Actually Needs",
    slug: "web-dev-vs-graphic-design",
    category: "Strategy",
    excerpt:
      "Why hybrid execution between technical precision and visual direction is the fastest way to build premium digital presence.",
    content:
      "## The real constraint is not talent, it is coordination.\nTeams often split design and development too early. That creates handoff friction and weak product momentum.\n\n### Hybrid execution reduces waste.\nWhen visual direction and implementation decisions are aligned from day one, you avoid rework, improve speed, and keep quality high.\n\n## Practical decision model.\nFor growth-stage companies, start with outcomes: conversion goals, speed, and maintainability. Then staff for the delivery model that supports those outcomes.",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    author: "Attila Lazar",
    published: true,
    readTime: "5 min",
    date: now - 2 * 86_400_000,
    tags: ["strategy", "web-development", "design"],
  },
  {
    _id: "fallback-post-how-i-build-premium-sites",
    title: "How I Build Premium Business Websites that Convert",
    slug: "how-i-build-premium-sites",
    category: "Development",
    excerpt:
      "A production workflow for performance, storytelling, and conversion architecture in modern web builds.",
    content:
      "## Start with conversion architecture.\nBefore UI polish, define the conversion path, page hierarchy, and trust signals for each stage.\n\n### Build around performance budgets.\nDesign intent must respect performance budgets. Fast pages win distribution, engagement, and conversion.\n\n## Ship in measured increments.\nLaunch core flows first, measure behavior, and iterate where data confirms friction.",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
    author: "Attila Lazar",
    published: true,
    readTime: "8 min",
    date: now - 5 * 86_400_000,
    tags: ["development", "nextjs", "performance"],
  },
  {
    _id: "fallback-post-ai-workflows-for-growth",
    title: "AI Workflows That Actually Move Revenue",
    slug: "ai-workflows-that-move-revenue",
    category: "AI",
    excerpt:
      "A practical framework for selecting automation opportunities that reduce cost and increase delivery capacity.",
    content:
      "## Most AI projects fail at selection.\nThe issue is not model quality. It is choosing low-impact workflows that do not affect core business outcomes.\n\n### Prioritize repeatable bottlenecks.\nAutomate recurring tasks with clear cost and latency constraints first: qualification, routing, summarization, and response drafting.\n\n## Treat AI as product infrastructure.\nOperationalize telemetry, guardrails, and iteration loops so automation quality improves over time.",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
    author: "Attila Lazar",
    published: true,
    readTime: "6 min",
    date: now - 9 * 86_400_000,
    tags: ["ai", "automation", "growth"],
  },
];

export function findFallbackPostBySlug(slug: string) {
  return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null;
}
