import { query } from "./_generated/server";
import { v } from "convex/values";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

const EVENTS_SAMPLE_LIMIT = 3000;
const LEADS_SAMPLE_LIMIT = 5000;

export const getConversionStats = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const events = await ctx.db
      .query("events")
      .withIndex("by_type", (q) => q.eq("type", "conversion"))
      .order("desc")
      .take(EVENTS_SAMPLE_LIMIT);

    const stats = {
      totalConversions: events.length,
      totalValue: events.reduce((acc, curr) => acc + (curr.value || 0), 0),
      byType: {} as Record<string, number>,
    };

    events.forEach((event) => {
      const type = event.conversionType || "unknown";
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  },
});

export const getFunnelData = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    // Simplified funnel: All Views -> Demo Views -> Conversions
    const allEvents = await ctx.db.query("events").order("desc").take(EVENTS_SAMPLE_LIMIT);
    
    const views = allEvents.filter(e => e.type === "view").length;
    const demoViews = allEvents.filter(e => e.type === "view" && e.route.startsWith("/demos")).length;
    const conversions = allEvents.filter(e => e.type === "conversion").length;

    return [
      { step: "Total Visitors", count: views, color: "var(--accent-gold)" },
      { step: "Demo Interest", count: demoViews, color: "#6366f1" },
      { step: "Conversions", count: conversions, color: "#10b981" },
    ];
  },
});

export const getPipelineValue = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const leads = await ctx.db.query("leads").order("desc").take(LEADS_SAMPLE_LIMIT);
    // Approximate pipeline value by lead stage.
    const stageWeights: Record<string, number> = {
      New: 300,
      Qualified: 1000,
      Proposal: 3000,
      Won: 6000,
      Lost: 0,
      // Legacy statuses kept for backwards compatibility.
      new: 300,
      hot: 2000,
      warm: 500,
      cold: 50,
    };

    return leads.reduce((acc, lead) => {
      return acc + (stageWeights[lead.status] ?? 100);
    }, 0);
  },
});
