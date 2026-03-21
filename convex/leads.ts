import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    budget: v.string(),
    message: v.string(),
    company: v.optional(v.string()),
    timeline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      ...args,
      status: "New",
      notes: [],
      createdAt: Date.now(),
    });
    return leadId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: { id: v.id("leads"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const addNote = mutation({
  args: { id: v.id("leads"), note: v.string() },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) return;
    const notes = lead.notes || [];
    await ctx.db.patch(args.id, { 
      notes: [...notes, { body: args.note, timestamp: Date.now() }] 
    });
  },
});

export const del = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
