import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

function sanitizeHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"');
}

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
    adminToken: ADMIN_TOKEN,
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
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.insert("posts", {
      title: args.title,
      slug: args.slug,
      category: args.category,
      excerpt: args.excerpt,
      content: sanitizeHtml(args.content),
      coverImage: args.coverImage,
      author: args.author,
      published: args.published,
      readTime: args.readTime,
      tags: args.tags,
      blocks: args.blocks,
      date: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
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
      category: args.category,
      excerpt: args.excerpt,
      content: typeof args.content === "string" ? sanitizeHtml(args.content) : undefined,
      coverImage: args.coverImage,
      author: args.author,
      published: args.published,
      readTime: args.readTime,
      tags: args.tags,
      blocks: args.blocks,
    });
  },
});

export const del = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.delete(args.id);
  },
});
