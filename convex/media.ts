import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

export const generateUploadUrl = mutation({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMedia = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    storageId: v.id("_storage"),
    name: v.string(),
    size: v.number(),
    type: v.string(),
    alt: v.optional(v.string()),
    metadata: v.optional(v.object({
      width: v.optional(v.number()),
      height: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.insert("media", {
      storageId: args.storageId,
      name: args.name,
      size: args.size,
      type: args.type,
      alt: args.alt,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

export const updateMedia = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.id("media"),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.id, { alt: args.alt });
  },
});

export const getMedia = query({
  handler: async (ctx) => {
    const media = await ctx.db.query("media").order("desc").collect();
    
    return Promise.all(
      media.map(async (m) => ({
        ...m,
        url: await ctx.storage.getUrl(m.storageId),
      }))
    );
  },
});

export const deleteMedia = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("media") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const media = await ctx.db.get(args.id);
    if (!media) return;
    
    await ctx.storage.delete(media.storageId);
    await ctx.db.delete(args.id);
  },
});
