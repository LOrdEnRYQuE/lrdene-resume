import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

export const list = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
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
    adminToken: ADMIN_TOKEN,
    id: v.id("siteMetadata"),
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      keywords: args.keywords,
      ogImage: args.ogImage,
    });
  },
});

export const create = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    route: v.string(),
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const existing = await ctx.db
      .query("siteMetadata")
      .withIndex("by_route", (q) => q.eq("route", args.route))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        route: args.route,
        title: args.title,
        description: args.description,
        keywords: args.keywords,
        ogImage: args.ogImage,
      });
      return existing._id;
    }

    return await ctx.db.insert("siteMetadata", {
      route: args.route,
      title: args.title,
      description: args.description,
      keywords: args.keywords,
      ogImage: args.ogImage,
    });
  },
});
