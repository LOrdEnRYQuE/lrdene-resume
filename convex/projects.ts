import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category !== undefined) {
      const category = args.category;
      return await ctx.db
        .query("projects")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    }
    return await ctx.db.query("projects").collect();
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

export const getFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
  },
});

export const create = mutation({
  args: {
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
    coverImage: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", args);
  },
});

export const update = mutation({
  args: {
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
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const del = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
