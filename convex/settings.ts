import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("settings").unique();
  },
});

export const update = mutation({
  args: {
    id: v.optional(v.id("settings")),
    siteName: v.string(),
    siteDescription: v.string(),
    gaId: v.optional(v.string()),
    gtmId: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      github: v.optional(v.string()),
      twitter: v.optional(v.string()),
      linkedin: v.optional(v.string()),
    })),
    emailConfig: v.optional(v.object({
      receiver: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    if (id) {
      await ctx.db.patch(id, fields);
    } else {
      const existing = await ctx.db.query("settings").unique();
      if (existing) {
        await ctx.db.patch(existing._id, fields);
      } else {
        await ctx.db.insert("settings", fields);
      }
    }
  },
});

export const listMetadata = query({
  handler: async (ctx) => {
    return await ctx.db.query("siteMetadata").collect();
  },
});

export const updateMetadata = mutation({
  args: {
    id: v.optional(v.id("siteMetadata")),
    route: v.string(),
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    if (id) {
      await ctx.db.patch(id, fields);
    } else {
      const existing = await ctx.db
        .query("siteMetadata")
        .withIndex("by_route", (q) => q.eq("route", args.route))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, fields);
      } else {
        await ctx.db.insert("siteMetadata", fields);
      }
    }
  },
});
