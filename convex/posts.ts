import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    onlyPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let postsQuery;

    if (args.category) {
      const cat = args.category;
      postsQuery = ctx.db.query("posts").withIndex("by_category", (q) => q.eq("category", cat));
    } else {
      postsQuery = ctx.db.query("posts");
    }

    const posts = await postsQuery.order("desc").collect();

    if (args.onlyPublished) {
      return posts.filter(p => p.published);
    }
    return posts;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.string(),
    author: v.string(),
    published: v.boolean(),
    readTime: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      ...args,
      date: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    category: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    author: v.optional(v.string()),
    published: v.optional(v.boolean()),
    readTime: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const del = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
