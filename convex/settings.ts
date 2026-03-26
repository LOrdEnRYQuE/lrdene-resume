import { v } from "convex/values";
import { internalQuery, query, mutation } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

function sanitizePublicSettings(settings: any) {
  if (!settings) {
    return settings;
  }
  return {
    _id: settings._id,
    _creationTime: settings._creationTime,
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    gaId: settings.gaId,
    maintenanceMode: settings.maintenanceMode,
    socialLinks: settings.socialLinks,
    appearance: settings.appearance,
  };
}

export const get = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").unique();
    return sanitizePublicSettings(settings);
  },
});

export const getAdmin = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.query("settings").unique();
  },
});

export const getInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("settings").unique();
  },
});

export const update = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    siteName: v.string(),
    siteDescription: v.string(),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    gaId: v.string(),
    maintenanceMode: v.optional(v.boolean()),
    socialLinks: v.object({
      github: v.string(),
      twitter: v.string(),
      linkedin: v.string(),
      instagram: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
    emailConfig: v.object({
      receiver: v.string(),
      senderName: v.optional(v.string()),
      senderEmail: v.optional(v.string()),
      webhookSecret: v.optional(v.string()),
    }),
    appearance: v.optional(v.object({
      primaryColor: v.string(),
      accentColor: v.string(),
      fontFamily: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const payload = {
      siteName: args.siteName,
      siteDescription: args.siteDescription,
      heroTitle: args.heroTitle,
      heroSubtitle: args.heroSubtitle,
      gaId: args.gaId,
      maintenanceMode: args.maintenanceMode,
      socialLinks: args.socialLinks,
      emailConfig: args.emailConfig,
      appearance: args.appearance,
    };
    const existing = await ctx.db.query("settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("settings", payload);
    }
  },
});

export const listMetadata = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.query("siteMetadata").collect();
  },
});

export const updateMetadata = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.optional(v.id("siteMetadata")),
    route: v.string(),
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const fields = {
      route: args.route,
      title: args.title,
      description: args.description,
      keywords: args.keywords,
      ogImage: args.ogImage,
    };
    const id = args.id;
    if (id) {
      await ctx.db.patch(id, fields);
    } else {
      const existing = await ctx.db
        .query("siteMetadata")
        .withIndex("by_route", (q) => q.eq("route", args.route))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, fields);
      } else {
        await ctx.db.insert("siteMetadata", fields);
      }
    }
  },
});
