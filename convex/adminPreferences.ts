import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ADMIN_TOKEN, getAdminUsernameFromToken } from "./adminAuth";

export const get = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    const username = await getAdminUsernameFromToken(args.adminToken);
    const doc = await ctx.db
      .query("adminPreferences")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    return {
      leadNichePreset: doc?.leadNichePreset ?? "all",
      leadViewMode: doc?.leadViewMode === "list" ? "list" : "kanban",
    };
  },
});

export const updateLeadNichePreset = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    leadNichePreset: v.string(),
  },
  handler: async (ctx, args) => {
    const username = await getAdminUsernameFromToken(args.adminToken);
    const now = Date.now();
    const existing = await ctx.db
      .query("adminPreferences")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        leadNichePreset: args.leadNichePreset,
        updatedAt: now,
      });
      return;
    }

    await ctx.db.insert("adminPreferences", {
      username,
      leadNichePreset: args.leadNichePreset,
      leadViewMode: "kanban",
      updatedAt: now,
    });
  },
});

export const updateLeadViewMode = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    leadViewMode: v.union(v.literal("list"), v.literal("kanban")),
  },
  handler: async (ctx, args) => {
    const username = await getAdminUsernameFromToken(args.adminToken);
    const now = Date.now();
    const existing = await ctx.db
      .query("adminPreferences")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        leadViewMode: args.leadViewMode,
        updatedAt: now,
      });
      return;
    }

    await ctx.db.insert("adminPreferences", {
      username,
      leadNichePreset: "all",
      leadViewMode: args.leadViewMode,
      updatedAt: now,
    });
  },
});
