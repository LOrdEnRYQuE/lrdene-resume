import { v } from "convex/values";
import { internalMutation, mutation, query, type MutationCtx } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

const AUTO_POST_SOURCE = "portfolio_30_day_challenge";
const DEFAULT_AUTHOR = "Attila Lazar";
const DAY_MS = 24 * 60 * 60 * 1000;

const DAILY_TOPICS = [
  "A Guide to Custom Web Design for Modern Businesses",
  "Smart Business Cards: The Future of Networking",
  "Leveraging Your Digital Card App for Better Networking",
  "Template vs. Custom Website: Which is Right for You?",
  "What is a BrandKit? A Guide to Visual Identity",
  "Building a Brand, Not Just a Business",
  "2D vs. 3D Logos: Adding Depth to Your Brand Image",
  "Animated vs. Static Logos: Which is More Effective?",
  "Key Benefits of a Custom Mobile App for Your Business",
  "The Role of a BrandKit in Social Media Consistency",
  "The Web Design Process: From Concept to Launch",
  "The Psychology of Logo Design: Shape and Color",
  "Designing Striking Visuals for Instagram and Facebook",
  "What is a VCF Card and How Does it Work?!",
  "Choosing a Company Logo Creator: Key Considerations",
  "Mobile App vs. Mobile Website: A Strategic Choice",
  "The Professional's Guide to Digital Business Cards",
  "Our 3D Logo Design Services: The Creative Process",
  "Creating Your Digital Business Card on an iPhone",
  "Free Digital Business Cards: Are They Worth It?",
  "Traditional vs. Digital Business Cards: A 2026 Perspective",
  "Why Professional Design Outperforms Card Maker Freeware",
  "How to Make a Digital Business Card: A Simple Guide",
  "Choosing a Web Design Agency in Landshut",
  "NFC vs. QR Code Business Cards: Which is Superior?",
  "Digital Business Card Creator in Germany: What to Look For",
  "A Guide to Social Media Content for Premium Brands",
  "Finding the Best 3D Logo Maker for Your Project",
  "Elevate Your Brand with Professional 3D Logo Design",
  "Reflecting on 30 Days of Content: Growth and Next Steps for My Web Portfolio",
] as const;

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function dedupeSlug(base: string, index: number) {
  return index === 0 ? base : `${base}-${index + 1}`;
}

function inferCategory(topic: string) {
  const lower = topic.toLowerCase();
  if (lower.includes("logo") || lower.includes("brandkit") || lower.includes("brand")) {
    return "Design";
  }
  if (lower.includes("app") || lower.includes("website") || lower.includes("web design")) {
    return "Development";
  }
  if (lower.includes("landshut") || lower.includes("agency")) {
    return "Insights";
  }
  return "Strategy";
}

function inferCoverImage(topic: string) {
  const lower = topic.toLowerCase();
  if (lower.includes("logo") || lower.includes("brand")) {
    return "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2200&auto=format&fit=crop";
  }
  if (lower.includes("card") || lower.includes("network")) {
    return "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=2200&auto=format&fit=crop";
  }
  if (lower.includes("app")) {
    return "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2200&auto=format&fit=crop";
  }
  return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2200&auto=format&fit=crop";
}

function buildPostContent(topic: string, day: number) {
  return [
    `## Day ${day}: ${topic}`,
    `This article is part of a 30-day publishing sprint focused on web design, branding, and digital growth topics for modern businesses.`,
    "## Why this topic matters",
    "Search intent around this topic usually signals decision-stage buyers comparing implementation options and provider quality.",
    "A strong article should clarify tradeoffs, remove ambiguity, and map each recommendation to business outcomes.",
    "## Practical framework",
    "1. Define objective and audience segment.",
    "2. Evaluate options by speed, cost, maintainability, and conversion impact.",
    "3. Implement a measurable version first, then iterate using analytics.",
    "## Execution checklist",
    "- Align content with service pages and internal links.",
    "- Add examples, visuals, and one concrete next step.",
    "- Track clicks, scroll depth, and inquiry conversion rate.",
    "## Final recommendation",
    "Treat this topic as an operating decision, not just design preference. The best choice is the one that compounds growth over the next 6-12 months.",
  ].join("\n\n");
}

function buildExcerpt(topic: string) {
  return `A practical guide to ${topic.toLowerCase()} with clear implementation steps, tradeoffs, and growth-focused recommendations.`;
}

function buildTags(topic: string) {
  const base = ["web design", "digital branding", "portfolio growth"];
  const lower = topic.toLowerCase();
  if (lower.includes("logo")) base.push("logo design");
  if (lower.includes("business card")) base.push("digital business cards");
  if (lower.includes("app")) base.push("mobile apps");
  if (lower.includes("agency")) base.push("local seo");
  return base;
}

function nextDailySlotFrom(baseTimestamp: number) {
  const base = new Date(baseTimestamp);
  const today0930 = Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 9, 30, 0, 0);
  return baseTimestamp < today0930 ? today0930 : today0930 + DAY_MS;
}

async function seedQueueItems(ctx: MutationCtx, startAt: number) {
  const seenSlugs = new Set<string>();

  for (let index = 0; index < DAILY_TOPICS.length; index += 1) {
    const day = index + 1;
    const title = DAILY_TOPICS[index];
    const category = inferCategory(title);
    const baseSlug = normalizeSlug(title);
    let slug = dedupeSlug(baseSlug, 0);
    let bump = 1;
    while (seenSlugs.has(slug)) {
      slug = dedupeSlug(baseSlug, bump);
      bump += 1;
    }
    seenSlugs.add(slug);

    await ctx.db.insert("autoPostQueue", {
      day,
      title,
      slug,
      category,
      excerpt: buildExcerpt(title),
      content: buildPostContent(title, day),
      coverImage: inferCoverImage(title),
      readTime: "6 min",
      tags: buildTags(title),
      publishAt: startAt + index * DAY_MS,
      status: "queued",
      source: AUTO_POST_SOURCE,
    });
  }
}

async function publishNextDue(ctx: MutationCtx) {
  const now = Date.now();
  const nextQueued = await ctx.db
    .query("autoPostQueue")
    .withIndex("by_status_and_publishAt", (q) => q.eq("status", "queued").lte("publishAt", now))
    .order("asc")
    .first();

  if (!nextQueued) {
    return {
      published: false,
      reason: "No queued post due at this time.",
    };
  }

  const existingPost = await ctx.db
    .query("posts")
    .withIndex("by_slug", (q) => q.eq("slug", nextQueued.slug))
    .unique();

  if (existingPost) {
    await ctx.db.patch(nextQueued._id, {
      status: "skipped",
      publishedAt: now,
      publishedPostId: existingPost._id,
      error: "Skipped because a post with the same slug already exists.",
    });
    return {
      published: false,
      reason: "Duplicate slug in posts table.",
      queueId: nextQueued._id,
      postId: existingPost._id,
    };
  }

  const postId = await ctx.db.insert("posts", {
    title: nextQueued.title,
    slug: nextQueued.slug,
    category: nextQueued.category,
    excerpt: nextQueued.excerpt,
    content: nextQueued.content,
    coverImage: nextQueued.coverImage,
    author: DEFAULT_AUTHOR,
    published: true,
    readTime: nextQueued.readTime,
    tags: nextQueued.tags,
    date: now,
  });

  await ctx.db.patch(nextQueued._id, {
    status: "published",
    publishedAt: now,
    publishedPostId: postId,
    error: undefined,
  });

  return {
    published: true,
    queueId: nextQueued._id,
    postId,
    title: nextQueued.title,
    publishAt: nextQueued.publishAt,
  };
}

export const listQueue = query({
  args: {
    adminToken: ADMIN_TOKEN,
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db
      .query("autoPostQueue")
      .withIndex("by_source_and_publishAt", (q) => q.eq("source", AUTO_POST_SOURCE))
      .order("asc")
      .take(60);
  },
});

export const seedDailyChallenge = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    reset: v.optional(v.boolean()),
    startAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);

    const existing = await ctx.db
      .query("autoPostQueue")
      .withIndex("by_source_and_publishAt", (q) => q.eq("source", AUTO_POST_SOURCE))
      .order("asc")
      .take(120);

    if (args.reset) {
      for (const item of existing) {
        await ctx.db.delete(item._id);
      }
    } else if (existing.length > 0) {
      return {
        seeded: 0,
        existing: existing.length,
        message: "Queue already seeded. Pass reset=true to recreate schedule.",
      };
    }

    const startAt = typeof args.startAt === "number" ? args.startAt : nextDailySlotFrom(Date.now());
    await seedQueueItems(ctx, startAt);

    return {
      seeded: DAILY_TOPICS.length,
      startsAt: startAt,
      source: AUTO_POST_SOURCE,
    };
  },
});

export const publishNow = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await publishNextDue(ctx);
  },
});

export const publishFromCron = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingSeed = await ctx.db
      .query("autoPostQueue")
      .withIndex("by_source_and_publishAt", (q) => q.eq("source", AUTO_POST_SOURCE))
      .take(1);

    if (existingSeed.length === 0) {
      await seedQueueItems(ctx, Date.now());
    }

    return await publishNextDue(ctx);
  },
});
