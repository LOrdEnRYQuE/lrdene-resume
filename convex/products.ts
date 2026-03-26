import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    features: v.array(v.string()),
    techStack: v.optional(v.array(v.string())),
    downloadUrl: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.insert("products", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      price: args.price,
      currency: args.currency,
      imageUrl: args.imageUrl,
      category: args.category,
      features: args.features,
      techStack: args.techStack,
      downloadUrl: args.downloadUrl,
      active: args.active,
    });
  },
});

export const update = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.id("products"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    features: v.array(v.string()),
    techStack: v.optional(v.array(v.string())),
    downloadUrl: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.id, {
      name: args.name,
      slug: args.slug,
      description: args.description,
      price: args.price,
      currency: args.currency,
      imageUrl: args.imageUrl,
      category: args.category,
      features: args.features,
      techStack: args.techStack,
      downloadUrl: args.downloadUrl,
      active: args.active,
    });
  },
});

export const remove = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.delete(args.id);
  },
});
