import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
});

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("services").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    iconName: v.string(),
    price: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    features: v.array(v.string()),
    process: v.array(v.object({
      step: v.string(),
      desc: v.string(),
    })),
    status: v.string(),
    category: v.string(),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.insert("services", {
      title: args.title,
      slug: args.slug,
      description: args.description,
      iconName: args.iconName,
      price: args.price,
      deliveryTime: args.deliveryTime,
      features: args.features,
      process: args.process,
      status: args.status,
      category: args.category,
      featured: args.featured,
    });
  },
});

export const update = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.id("services"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    iconName: v.string(),
    price: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    features: v.array(v.string()),
    process: v.array(v.object({
      step: v.string(),
      desc: v.string(),
    })),
    status: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.id, {
      title: args.title,
      slug: args.slug,
      description: args.description,
      iconName: args.iconName,
      price: args.price,
      deliveryTime: args.deliveryTime,
      features: args.features,
      process: args.process,
      status: args.status,
      category: args.category,
    });
  },
});

export const remove = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("services") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.delete(args.id);
  },
});
