import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

const ANALYTICS_SAMPLE_LIMIT = 5000;
const EVENTS_SAMPLE_LIMIT = 2000;
const CONSENT_SAMPLE_LIMIT = 2000;

const EMPTY_OVERVIEW = {
  totalViews: 0,
  uniqueVisitors: 0,
  viewsByRoute: {} as Record<string, number>,
  recentEvents: [] as any[],
  acquisition: {
    bySource: {} as Record<string, number>,
    byMedium: {} as Record<string, number>,
    byCampaign: {} as Record<string, number>,
    byLandingPage: {} as Record<string, number>,
    conversionRate: 0,
  },
  salesIntent: {
    byProjectType: {} as Record<string, number>,
    byBudget: {} as Record<string, number>,
    byTimeline: {} as Record<string, number>,
    byPromotionTier: {} as Record<string, number>,
  },
  funnel: {
    formStarts: 0,
    formStepViews: 0,
    formSubmissions: 0,
    ctaClicks: 0,
    serviceViews: 0,
    projectViews: 0,
    demoOpens: 0,
  },
  sampled: false,
};

function parseEventLabel(label: string) {
  const [baseLabel, ...tagParts] = label.split(" | ");
  const tags = tagParts.reduce((acc, part) => {
    const idx = part.indexOf(":");
    if (idx === -1) return acc;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) return acc;
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return { baseLabel, tags };
}

function incrementCounter(counter: Record<string, number>, key: string | undefined) {
  if (!key) return;
  counter[key] = (counter[key] || 0) + 1;
}

export const recordPageView = mutation({
  args: {
    route: v.string(),
    referrer: v.optional(v.string()),
    device: v.optional(v.string()),
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const recordEvent = mutation({
  args: {
    type: v.string(),
    label: v.string(),
    route: v.string(),
    sessionId: v.string(),
    conversionType: v.optional(v.string()),
    value: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const recordCookieConsent = mutation({
  args: {
    consentVersion: v.string(),
    essential: v.boolean(),
    analytics: v.boolean(),
    marketing: v.boolean(),
    source: v.string(),
    locale: v.string(),
    route: v.optional(v.string()),
    anonymizedSession: v.optional(v.string()),
    device: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cookieConsentLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getOverview = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    try {
      const allViews = await ctx.db.query("analytics").order("desc").take(ANALYTICS_SAMPLE_LIMIT);
      const allEvents = await ctx.db.query("events").order("desc").take(EVENTS_SAMPLE_LIMIT);

      // Group by route
      const viewsByRoute = allViews.reduce((acc: Record<string, number>, view) => {
        if (!view.route) return acc;
        acc[view.route] = (acc[view.route] || 0) + 1;
        return acc;
      }, {});

      // Unique sessions
      const uniqueSessions = new Set(allViews.map((v) => v.sessionId).filter(Boolean)).size;

      const attributionBySource: Record<string, number> = {};
      const attributionByMedium: Record<string, number> = {};
      const attributionByCampaign: Record<string, number> = {};
      const attributionByLandingPage: Record<string, number> = {};

      const salesByProjectType: Record<string, number> = {};
      const salesByBudget: Record<string, number> = {};
      const salesByTimeline: Record<string, number> = {};
      const salesByPromotionTier: Record<string, number> = {};

      let formStarts = 0;
      let formStepViews = 0;
      let formSubmissions = 0;
      let ctaClicks = 0;
      let serviceViews = 0;
      let projectViews = 0;
      let demoOpens = 0;

      for (const event of allEvents) {
        const { tags } = parseEventLabel(event.label || "");

        incrementCounter(attributionBySource, tags.source);
        incrementCounter(attributionByMedium, tags.medium);
        incrementCounter(attributionByCampaign, tags.campaign);
        incrementCounter(attributionByLandingPage, tags.landing_page);

        if (event.type === "start_contact_form") formStarts += 1;
        if (event.type === "contact_step_view") formStepViews += 1;
        if (event.type === "submit_contact_form") formSubmissions += 1;
        if (event.type === "click_cta") ctaClicks += 1;
        if (event.type === "view_service") serviceViews += 1;
        if (event.type === "view_project") projectViews += 1;
        if (event.type === "open_demo") demoOpens += 1;

        if (event.type === "submit_contact_form") {
          incrementCounter(salesByProjectType, tags.projectType);
          incrementCounter(salesByBudget, tags.budget);
          incrementCounter(salesByTimeline, tags.timeline);
          incrementCounter(salesByPromotionTier, tags.promotion_tier);
        }
      }

      const conversionRate =
        uniqueSessions > 0 ? Number(((formSubmissions / uniqueSessions) * 100).toFixed(2)) : 0;

      return {
        totalViews: allViews.length,
        uniqueVisitors: uniqueSessions,
        viewsByRoute,
        recentEvents: allEvents.slice(0, 10),
        acquisition: {
          bySource: attributionBySource,
          byMedium: attributionByMedium,
          byCampaign: attributionByCampaign,
          byLandingPage: attributionByLandingPage,
          conversionRate,
        },
        salesIntent: {
          byProjectType: salesByProjectType,
          byBudget: salesByBudget,
          byTimeline: salesByTimeline,
          byPromotionTier: salesByPromotionTier,
        },
        funnel: {
          formStarts,
          formStepViews,
          formSubmissions,
          ctaClicks,
          serviceViews,
          projectViews,
          demoOpens,
        },
        sampled: allViews.length === ANALYTICS_SAMPLE_LIMIT || allEvents.length === EVENTS_SAMPLE_LIMIT,
      };
    } catch (error) {
      console.error("analytics.getOverview failed, returning safe defaults", error);
      return EMPTY_OVERVIEW;
    }
  },
});

export const getConsentOverview = query({
  args: {
    adminToken: ADMIN_TOKEN,
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);

    const normalizedDays =
      typeof args.days === "number" && Number.isFinite(args.days) && args.days > 0
        ? Math.min(Math.floor(args.days), 365)
        : null;
    const cutoff = normalizedDays ? Date.now() - normalizedDays * 24 * 60 * 60 * 1000 : null;

    const consentLogs = await ctx.db
      .query("cookieConsentLogs")
      .withIndex("by_timestamp", (q) => (cutoff ? q.gte("timestamp", cutoff) : q))
      .order("desc")
      .take(CONSENT_SAMPLE_LIMIT);

    const bySource: Record<string, number> = {};
    const byLocale: Record<string, number> = {};
    const byDevice: Record<string, number> = {};

    let analyticsAccepted = 0;
    let analyticsRejected = 0;
    let marketingAccepted = 0;
    let marketingRejected = 0;

    for (const log of consentLogs) {
      incrementCounter(bySource, log.source || "unknown");
      incrementCounter(byLocale, log.locale || "unknown");
      incrementCounter(byDevice, log.device || "unknown");

      if (log.analytics) analyticsAccepted += 1;
      else analyticsRejected += 1;

      if (log.marketing) marketingAccepted += 1;
      else marketingRejected += 1;
    }

    const total = consentLogs.length;
    const analyticsOptInRate = total > 0 ? Number(((analyticsAccepted / total) * 100).toFixed(2)) : 0;
    const marketingOptInRate = total > 0 ? Number(((marketingAccepted / total) * 100).toFixed(2)) : 0;

    return {
      total,
      analyticsAccepted,
      analyticsRejected,
      marketingAccepted,
      marketingRejected,
      analyticsOptInRate,
      marketingOptInRate,
      bySource,
      byLocale,
      byDevice,
      recent: consentLogs.slice(0, 12),
      sampled: consentLogs.length === CONSENT_SAMPLE_LIMIT,
    };
  },
});
