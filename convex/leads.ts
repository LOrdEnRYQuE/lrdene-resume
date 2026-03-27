import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    budget: v.string(),
    message: v.string(),
    company: v.optional(v.string()),
    timeline: v.optional(v.string()),
    niche: v.optional(v.string()),
    privacyConsent: v.optional(v.boolean()),
    privacyConsentAt: v.optional(v.number()),
    privacyConsentVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      ...args,
      status: "New",
      notes: [],
      createdAt: Date.now(),
    });

    // Trigger AI Scoring (Heuristic for now)
    await ctx.scheduler.runAfter(0, internal.leads.scoreLead, { id: leadId });
    await ctx.scheduler.runAfter(0, internal.communications.ingestLeadSubmission, { leadId });

    // Trigger Notifications
    await ctx.scheduler.runAfter(0, api.webhooks.sendDiscordNotification, {
      content: "🚀 **New Lead Captured!**",
      title: `Project Inquiry: ${args.name}`,
      description: args.message,
      fields: [
        { name: "Project Type", value: args.projectType, inline: true },
        { name: "Budget", value: args.budget, inline: true },
        { name: "Email", value: args.email, inline: false },
      ],
    });

    return leadId;
  },
});

export const scoreLead = internalMutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) return;

    let score = 20; // Base score
    // Budget heuristic
    const budget = lead.budget.toLowerCase();
    if (budget.includes("10k") || budget.includes("50k")) score += 50;
    else if (budget.includes("5k")) score += 30;
    else if (budget.includes("2k")) score += 15;

    // Project Type heuristic
    const type = lead.projectType.toLowerCase();
    if (type.includes("ai") || type.includes("dashboard") || type.includes("saas")) score += 20;

    // Message depth
    if (lead.message.length > 300) score += 10;
    score = Math.min(score, 100);

    let priority = "Low";
    if (score >= 70) priority = "High";
    else if (score >= 40) priority = "Medium";

    await ctx.db.patch(args.id, {
      aiScore: score,
      aiPriority: priority,
    });
  },
});

export const list = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.query("leads").order("desc").collect();
  },
});

export const listInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("leads"), status: v.string() },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const addNote = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("leads"), note: v.string() },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const lead = await ctx.db.get(args.id);
    if (!lead) return;
    const notes = lead.notes || [];
    await ctx.db.patch(args.id, { 
      notes: [...notes, { body: args.note, timestamp: Date.now() }] 
    });
  },
});

export const del = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.delete(args.id);
  },
});
