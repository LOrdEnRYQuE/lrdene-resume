import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const q = ctx.db.query("projects");
    
    if (args.category) {
      return await q
        .withIndex("by_category", (query) => query.eq("category", args.category!))
        .order("desc")
        .collect();
    }
    
    return await q.order("desc").collect();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    description: v.string(),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    role: v.string(),
    stack: v.array(v.string()),
    category: v.string(),
    featured: v.boolean(),
    status: v.string(),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    coverImage: v.string(),
    iconName: v.optional(v.string()),
    year: v.optional(v.string()),
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.insert("projects", {
      title: args.title,
      slug: args.slug,
      summary: args.summary,
      description: args.description,
      challenge: args.challenge,
      solution: args.solution,
      role: args.role,
      stack: args.stack,
      category: args.category,
      featured: args.featured,
      status: args.status,
      liveUrl: args.liveUrl,
      githubUrl: args.githubUrl,
      videoUrl: args.videoUrl,
      gallery: args.gallery,
      coverImage: args.coverImage,
      iconName: args.iconName,
      year: args.year,
      blocks: args.blocks,
    });
  },
});

export const update = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    role: v.optional(v.string()),
    stack: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    status: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    coverImage: v.optional(v.string()),
    iconName: v.optional(v.string()),
    year: v.optional(v.string()),
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.id, {
      title: args.title,
      slug: args.slug,
      summary: args.summary,
      description: args.description,
      challenge: args.challenge,
      solution: args.solution,
      role: args.role,
      stack: args.stack,
      category: args.category,
      featured: args.featured,
      status: args.status,
      liveUrl: args.liveUrl,
      githubUrl: args.githubUrl,
      videoUrl: args.videoUrl,
      gallery: args.gallery,
      coverImage: args.coverImage,
      iconName: args.iconName,
      year: args.year,
      blocks: args.blocks,
    });
  },
});

export const remove = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.delete(args.id);
  },
});

export const convertFromLead = mutation({
  args: { adminToken: ADMIN_TOKEN, leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new Error("Lead not found");

    const projectId = await ctx.db.insert("projects", {
      title: `${lead.name} • ${lead.projectType}`,
      slug: lead.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4),
      summary: lead.message.slice(0, 150),
      description: lead.message,
      category: "AI", // Default category
      role: "Owner & Lead",
      stack: ["Next.js", "Convex"],
      featured: false,
      status: "draft",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
      year: new Date().getFullYear().toString(),
    });

    await ctx.db.patch(args.leadId, { status: "Won" });
    return projectId;
  },
});

export const seedAllProjects = mutation({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const projects = [
      {
        title: "Vortex AI Dashboard",
        slug: "vortex-ai",
        summary: "A high-performance neural interface for real-time data processing and visual insights.",
        description: "Built for top-tier analytics teams, Vortex provides a complete overview of neural network performance and system health.",
        category: "AI",
        role: "Lead Architect",
        stack: ["Next.js", "Convex", "PyTorch", "Three.js"],
        year: "2024",
        featured: true,
        status: "active",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
      },
      {
        title: "Quantum Design System",
        slug: "quantum-design",
        summary: "Architecting a scalable multi-platform design language for fintech startups.",
        description: "A comprehensive design system that scales across web, mobile, and print applications.",
        category: "Design",
        role: "Design Lead",
        stack: ["Figma", "React", "TypeScript", "Tailwind CSS"],
        year: "2024",
        featured: false,
        status: "active",
        coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2426"
      },
      {
        title: "Nexis E-Commerce",
        slug: "nexis-ecommerce",
        summary: "Modern storefront with headless CMS and integrated edge-functions for global scaling.",
        description: "Revolutionizing online retail with lightning-fast performance and seamless checkout flows.",
        category: "Web",
        role: "Full Stack Developer",
        stack: ["Next.js", "Stripe", "Prismic", "Cloudflare"],
        year: "2023",
        featured: true,
        status: "active",
        coverImage: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=2426"
      }
    ];

    for (const project of projects) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", project.slug))
        .unique();

      if (!existing) {
        await ctx.db.insert("projects", project);
      }
    }
  },
});
