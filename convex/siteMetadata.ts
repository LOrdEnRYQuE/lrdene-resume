import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("siteMetadata").collect();
  },
});

export const getByRoute = query({
  args: { route: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("siteMetadata")
      .withIndex("by_route", (q) => q.eq("route", args.route))
      .unique();
  },
});

export const update = mutation({
  args: {
    id: v.id("siteMetadata"),
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const create = mutation({
  args: {
    route: v.string(),
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteMetadata")
      .withIndex("by_route", (q) => q.eq("route", args.route))
      .unique();
    
    if (existing) {
      const { _id, ...rest } = existing;
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("siteMetadata", args);
  },
});
