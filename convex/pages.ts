import { v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

const SECTION_STATUS = v.union(v.literal("draft"), v.literal("published"));
const LOCALE = v.union(v.literal("en"), v.literal("de"));
const ADMIN_PAGE_SECTIONS_LIMIT = 2000;

const LEGACY_SECTION_BRIDGE: Record<string, { page: string; sectionKey: string; type: string }> = {
  navbar: { page: "global", sectionKey: "navbar", type: "navigation" },
  footer: { page: "global", sectionKey: "footer", type: "footer" },
  home_hero: { page: "home", sectionKey: "hero", type: "hero" },
  about: { page: "about", sectionKey: "about-main", type: "richText" },
  contact: { page: "contact", sectionKey: "contact-main", type: "richText" },
};

const DEFAULT_DESIGN_TOKENS = {
  palette: {
    primary: "#050505",
    accent: "#E5E4E2",
    background: "#0a0a0a",
    text: "#ffffff",
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    baseSizePx: 16,
  },
  button: {
    shape: "rounded" as const,
    radiusPx: 14,
    gradientFrom: "#f1f2f4",
    gradientMid: "#d4d8dc",
    gradientTo: "#b9bec4",
    textColor: "#121418",
    borderColor: "rgba(255, 255, 255, 0.65)",
    borderInnerColor: "rgba(120, 126, 136, 0.45)",
    shadow: "0 10px 22px rgba(0, 0, 0, 0.28)",
    pressedShadow: "inset 0 2px 6px rgba(255, 255, 255, 0.35), inset 0 -3px 8px rgba(80, 84, 92, 0.22)",
  },
};

function normalizeLocale(locale?: "en" | "de"): "en" | "de" {
  return locale === "de" ? "de" : "en";
}

function localizedKey(key: string, locale?: "en" | "de") {
  const normalized = normalizeLocale(locale);
  return normalized === "en" ? key : `${key}__${normalized}`;
}

function localizedSectionKey(sectionKey: string, locale?: "en" | "de") {
  const normalized = normalizeLocale(locale);
  return normalized === "en" ? sectionKey : `${sectionKey}__${normalized}`;
}

function localeFromSectionKey(sectionKey: string): "en" | "de" {
  if (sectionKey.endsWith("__de")) return "de";
  return "en";
}

function baseSectionKey(sectionKey: string) {
  return sectionKey.endsWith("__de") ? sectionKey.slice(0, -4) : sectionKey;
}

async function upsertLegacyPageContent(
  ctx: MutationCtx,
  key: string,
  data: unknown,
  locale?: "en" | "de",
) {
  const keyToWrite = localizedKey(key, locale);
  const existing = await ctx.db
    .query("pageContent")
    .withIndex("by_key", (q) => q.eq("key", keyToWrite))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      data,
      lastUpdated: Date.now(),
    });
  } else {
    await ctx.db.insert("pageContent", {
      key: keyToWrite,
      data,
      lastUpdated: Date.now(),
    });
  }
}

async function upsertPageSection(
  ctx: MutationCtx,
  args: {
    page: string;
    sectionKey: string;
    type: string;
    data: unknown;
    status: "draft" | "published";
    order: number;
  },
) {
  const existing = await ctx.db
    .query("pageSections")
    .withIndex("by_page_and_sectionKey", (q) => q.eq("page", args.page).eq("sectionKey", args.sectionKey))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      type: args.type,
      data: args.data,
      status: args.status,
      order: args.order,
      lastUpdated: Date.now(),
    });
    return existing._id;
  }

  return await ctx.db.insert("pageSections", {
    ...args,
    lastUpdated: Date.now(),
  });
}

export const listPages = query({
  args: {},
  handler: async (ctx) => {
    const pages = new Set<string>();

    const sections = await ctx.db.query("pageSections").take(300);
    for (const section of sections) {
      pages.add(section.page);
    }

    const legacy = await ctx.db.query("pageContent").take(100);
    for (const item of legacy) {
      const bridge = LEGACY_SECTION_BRIDGE[item.key];
      if (bridge) {
        pages.add(bridge.page);
      }
    }

    return Array.from(pages).sort();
  },
});

export const getPageSections = query({
  args: {
    page: v.string(),
    includeDraft: v.optional(v.boolean()),
    adminToken: v.optional(ADMIN_TOKEN),
  },
  handler: async (ctx, args) => {
    if (args.includeDraft) {
      if (!args.adminToken) {
        throw new Error("Admin token required for draft sections.");
      }
      await requireAdminToken(args.adminToken);
      return await ctx.db
        .query("pageSections")
        .withIndex("by_page_and_order", (q) => q.eq("page", args.page))
        .take(ADMIN_PAGE_SECTIONS_LIMIT);
    }

    return await ctx.db
      .query("pageSections")
      .withIndex("by_page_and_status_and_order", (q) => q.eq("page", args.page).eq("status", "published"))
      .take(ADMIN_PAGE_SECTIONS_LIMIT);
  },
});

export const getPageContent = query({
  args: { key: v.string(), locale: v.optional(LOCALE), fallbackToEnglish: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const locale = normalizeLocale(args.locale);
    const fallbackToEnglish = args.fallbackToEnglish ?? true;
    const primaryKey = localizedKey(args.key, locale);
    const content = await ctx.db
      .query("pageContent")
      .withIndex("by_key", (q) => q.eq("key", primaryKey))
      .unique();

    if (content) {
      return { ...content, key: args.key };
    }

    if (locale !== "en" && fallbackToEnglish) {
      const fallback = await ctx.db
        .query("pageContent")
        .withIndex("by_key", (q) => q.eq("key", args.key))
        .unique();
      if (fallback) {
        return { ...fallback, key: args.key };
      }
    }

    const bridge = LEGACY_SECTION_BRIDGE[args.key];
    if (!bridge) {
      return null;
    }

    const section =
      (await ctx.db
        .query("pageSections")
        .withIndex("by_page_and_sectionKey", (q) =>
          q.eq("page", bridge.page).eq("sectionKey", localizedSectionKey(bridge.sectionKey, locale)),
        )
        .unique()) ??
      (locale !== "en"
        ? await ctx.db
            .query("pageSections")
            .withIndex("by_page_and_sectionKey", (q) => q.eq("page", bridge.page).eq("sectionKey", bridge.sectionKey))
            .unique()
        : null);

    if (!section) {
      return null;
    }

    return {
      _id: section._id,
      _creationTime: section._creationTime,
      key: args.key,
      data: section.data,
      lastUpdated: section.lastUpdated,
    };
  },
});

export const upsertSection = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.optional(v.id("pageSections")),
    page: v.string(),
    sectionKey: v.string(),
    type: v.string(),
    data: v.any(),
    status: SECTION_STATUS,
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    let sectionId = args.id;

    if (sectionId) {
      await ctx.db.patch(sectionId, {
        page: args.page,
        sectionKey: args.sectionKey,
        type: args.type,
        data: args.data,
        status: args.status,
        order: args.order,
        lastUpdated: Date.now(),
      });
    } else {
      sectionId = await upsertPageSection(ctx, {
        page: args.page,
        sectionKey: args.sectionKey,
        type: args.type,
        data: args.data,
        status: args.status,
        order: args.order,
      });
    }

    const normalizedSectionKey = baseSectionKey(args.sectionKey);
    const sectionLocale = localeFromSectionKey(args.sectionKey);
    for (const [legacyKey, bridge] of Object.entries(LEGACY_SECTION_BRIDGE)) {
      if (bridge.page === args.page && bridge.sectionKey === normalizedSectionKey) {
        await upsertLegacyPageContent(ctx, legacyKey, args.data, sectionLocale);
      }
    }

    return sectionId;
  },
});

export const reorderSections = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    page: v.string(),
    orderedIds: v.array(v.id("pageSections")),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    for (let index = 0; index < args.orderedIds.length; index += 1) {
      await ctx.db.patch(args.orderedIds[index], {
        order: index,
        lastUpdated: Date.now(),
      });
    }

    return true;
  },
});

export const deleteSection = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("pageSections") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.delete(args.id);
    return true;
  },
});

export const updatePageContent = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    key: v.string(),
    data: v.any(),
    locale: v.optional(LOCALE),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const locale = normalizeLocale(args.locale);
    await upsertLegacyPageContent(ctx, args.key, args.data, locale);

    const bridge = LEGACY_SECTION_BRIDGE[args.key];
    if (!bridge) {
      return;
    }
    const effectiveSectionKey = localizedSectionKey(bridge.sectionKey, locale);

    const existing = await ctx.db
      .query("pageSections")
      .withIndex("by_page_and_sectionKey", (q) => q.eq("page", bridge.page).eq("sectionKey", effectiveSectionKey))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        type: bridge.type,
        lastUpdated: Date.now(),
      });
      return;
    }

    const maxOrder = await ctx.db
      .query("pageSections")
      .withIndex("by_page_and_order", (q) => q.eq("page", bridge.page))
      .order("desc")
      .take(1);

    await ctx.db.insert("pageSections", {
      page: bridge.page,
      sectionKey: effectiveSectionKey,
      type: bridge.type,
      data: args.data,
      status: "published",
      order: maxOrder.length > 0 ? maxOrder[0].order + 1 : 0,
      lastUpdated: Date.now(),
    });
  },
});

export const migrateLegacyContentToSections = mutation({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const migrated: string[] = [];

    for (const [legacyKey, bridge] of Object.entries(LEGACY_SECTION_BRIDGE)) {
      const legacy = await ctx.db
        .query("pageContent")
        .withIndex("by_key", (q) => q.eq("key", legacyKey))
        .unique();

      if (!legacy) {
        continue;
      }

      const existingSection = await ctx.db
        .query("pageSections")
        .withIndex("by_page_and_sectionKey", (q) => q.eq("page", bridge.page).eq("sectionKey", bridge.sectionKey))
        .unique();

      if (existingSection) {
        await ctx.db.patch(existingSection._id, {
          data: legacy.data,
          type: bridge.type,
          lastUpdated: Date.now(),
        });
      } else {
        await upsertPageSection(ctx, {
          page: bridge.page,
          sectionKey: bridge.sectionKey,
          type: bridge.type,
          data: legacy.data,
          status: "published",
          order: 0,
        });
      }

      migrated.push(legacyKey);
    }

    return { migratedKeys: migrated };
  },
});

export const getGlobalDesignTokens = query({
  args: {},
  handler: async (ctx) => {
    const tokens = await ctx.db
      .query("designTokens")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    return tokens?.data ?? DEFAULT_DESIGN_TOKENS;
  },
});

export const upsertGlobalDesignTokens = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    palette: v.object({
      primary: v.string(),
      accent: v.string(),
      background: v.string(),
      text: v.string(),
    }),
    typography: v.object({
      fontFamily: v.string(),
      baseSizePx: v.number(),
    }),
    button: v.object({
      shape: v.union(v.literal("pill"), v.literal("rounded"), v.literal("square")),
      radiusPx: v.number(),
      gradientFrom: v.string(),
      gradientTo: v.string(),
      gradientMid: v.optional(v.string()),
      textColor: v.string(),
      borderColor: v.string(),
      borderInnerColor: v.optional(v.string()),
      shadow: v.string(),
      pressedShadow: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const existing = await ctx.db
      .query("designTokens")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    const payload = {
      palette: args.palette,
      typography: args.typography,
      button: args.button,
    };

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: payload,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("designTokens", {
      key: "global",
      data: payload,
      updatedAt: Date.now(),
    });
  },
});

export const seedSiteContent = mutation({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const defaults = [
      {
        key: "navbar",
        data: {
          logo: "/assets/LOGO.png",
          ctaText: "Start a Project",
          links: [
            { name: "Services", href: "/services", hasMega: true },
            { name: "Demos", href: "/demos", hasMega: true },
            { name: "Projects", href: "/projects" },
            { name: "QR Solutions", href: "/qr-solutions" },
            { name: "About", href: "/about" },
            { name: "Blog", href: "/blog" },
            { name: "Contact", href: "/contact" },
          ],
        },
      },
      {
        key: "footer",
        data: {
          brandText: "Engineering the future of AI & Digital Architecture.",
          pillars: [
            {
              title: "Navigation",
              links: [
                { label: "Projects", href: "/projects" },
                { label: "Journal", href: "/blog" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ],
            },
            {
              title: "Services",
              links: [
                { label: "Web Dev", href: "/services/web-development" },
                { label: "AI Tools", href: "/services/ai-integration" },
                { label: "Design", href: "/services/ui-ux-design" },
              ],
            },
          ],
        },
      },
      {
        key: "home_hero",
        data: {
          headline: "Premium Websites, AI Products, and Design Systems.",
          subtitle:
            "I'm Attila Lazar, founder of LOrdEnRYQuE | Advanced Digital Solution — building websites, web apps, AI workflows, and interactive business MVPs that clients can test immediately.",
          ctaPrimary: "View Demos",
          ctaSecondary: "View Projects",
          stats: [
            { label: "Available", value: "For new builds", icon: "Zap" },
            { label: "14+ Years", value: "IT Experience", icon: "Code" },
          ],
        },
      },
      {
        key: "home_promotions",
        data: {
          eyebrow: "Startup Promotions",
          titleA: "Startup offers from",
          titleB: "10% to 50% OFF",
          subtitle:
            "For startup businesses, I offer project-based discounts. Entry starts at 10%, with up to 50% OFF for high-fit opportunities.",
          note: "Final discount level depends on project scope, timeline, and strategic fit.",
          cta: "Claim Startup Offer",
          tiers: [
            { off: "10%", stage: "Early-stage idea" },
            { off: "20%", stage: "MVP planning" },
            { off: "30%", stage: "Initial traction" },
            { off: "40%", stage: "Product-market validation" },
            { off: "50%", stage: "High-potential startup fit" },
          ],
        },
      },
      {
        key: "about",
        data: {
          hero: {
            tagline: "Professional Evolution",
            title: "Scaling Logic with Taste.",
            description:
              "From early IT infrastructure to modern AI engineering. A continuous journey of stacking complementary skills to build complete digital products that convert.",
            stats: [
              { label: "Projects Built", value: "50+" },
              { label: "Years Active", value: "14+" },
              { label: "Delivered", value: "100%" },
            ],
          },
          evolution: [
            {
              period: "2010 — 2017",
              title: "IT Foundations & Web Development",
              desc: "Began building websites and learning web technologies through hands-on experimentation. Worked extensively with early PHP-based CMS platforms and systems.",
              tech: ["PHP", "MySQL", "HTML / CSS", "JavaScript", "PHP-Fusion", "WordPress", "Joomla"],
              activities: [
                "Building and maintaining websites",
                "Server setup and hosting environments",
                "CMS customization and plugin integrations",
                "Database configuration and management",
              ],
              quote:
                "This phase built a strong understanding of web architecture, hosting infrastructure, and backend logic.",
              icon: "Cpu",
              color: "rgba(180, 200, 229, 0.15)",
            },
            {
              period: "2017 — 2023",
              title: "Graphic Design & Digital Production",
              desc: "Expanded skills into visual design, branding, and digital media production to support web projects and digital products.",
              tech: ["Photoshop", "Illustrator", "Affinity Designer", "UI / UX Layout"],
              activities: [
                "Website visual layouts",
                "Brand identity design",
                "Logo and marketing material creation",
                "Digital graphics for online platforms",
              ],
              quote:
                "This design experience strengthened the ability to bridge design and development, enabling visually polished products.",
              icon: "Palette",
              color: "rgba(229, 228, 226, 0.12)",
            },
            {
              period: "2023 — Present",
              title: "AI Engineering & Modern Development",
              desc: "Transitioned into modern frameworks and AI technologies, focusing on building intelligent software systems and AI-powered platforms.",
              tech: ["TypeScript", "Node.js", "React", "Next.js", "OpenAI APIs", "AI Agents", "Automation"],
              activities: [
                "AI-powered applications",
                "Developer platforms and tools",
                "SaaS web applications",
                "Automation systems for businesses",
              ],
              quote:
                "This phase focuses on combining full-stack development with artificial intelligence to build next-generation products.",
              icon: "Layers",
              color: "rgba(229, 228, 226, 0.1)",
            },
          ],
          skills: [
            { title: "Web Development", skills: "PHP, JavaScript, TypeScript, HTML, CSS", icon: "Code2" },
            { title: "Frontend", skills: "React, Next.js, UI architecture, responsive design", icon: "Palette" },
            { title: "Backend", skills: "Node.js, REST APIs, PostgreSQL, server infra", icon: "ShieldCheck" },
            { title: "AI Engineering", skills: "AI APIs, automation workflows, prompt engineering", icon: "Cpu" },
            { title: "Design & Visuals", skills: "Graphic design, UI/UX layout, brand identity", icon: "Layers" },
          ],
          values: [
            {
              icon: "Target",
              title: "Conversion Focused",
              desc: "Every pixel and line of code is optimized to turn visitors into loyal customers.",
            },
            {
              icon: "ShieldCheck",
              title: "Data Integrity",
              desc: "Robust architecture ensuring your business data is secure, compliant, and always available.",
            },
            {
              icon: "Zap",
              title: "Scaling Ready",
              desc: "Built with the future in mind. Solutions that grow as fast as your business does.",
            },
            {
              icon: "Users",
              title: "Human Centric",
              desc: "Complex technology translated into simple, intuitive experiences for your users.",
            },
          ],
        },
      },
      {
        key: "contact",
        data: {
          title: "Let's Build Your Next Digital Product.",
          subtitle: "Currently accepting selective client projects in Germany and across Europe.",
          email: "lordenryque.dev@gmail.com",
          whatsapp: "+49 1722620671",
          linkedin: "LOrdEnRQuE",
          location: "Germany BY, 84028. Landshut Nahensteig 188E",
          form: {
            enabled: true,
            submitLabel: "Send Inquiry",
            successTitle: "Inquiry Received!",
            successMessage: "Thanks for reaching out. I will review your project details and get back to you shortly.",
            projectTypes: ["Full Product Build", "AI-Native App", "Premium Branding", "Advisory/Consulting"],
            budgets: ["€10k - €25k", "€25k - €50k", "€50k+", "Equity Based (Select Startups)"],
            timelines: ["Urgent (< 1 Month)", "1-3 Months", "3-6 Months", "Long-term Partnership"],
            platformOptions: ["Mobile Application", "Desktop Application", "Web Application", "Cross-Platform"],
            goalOptions: ["Generate Leads", "Increase Sales", "Automate Operations", "Modernize Brand", "Launch MVP", "Prepare for Scale"],
            engagementOptions: ["Done-for-you (full delivery)", "Collaborative Sprint", "Technical Advisory", "Retainer / Long-term"],
            scopeOptions: ["Logo", "Pages", "Features", "Database", "Backend", "CMS/Admin", "SEO Setup", "Analytics"],
            advancedScopeOptions: ["Auth & Roles", "Payment Integration", "CRM Integration", "Marketing Automation", "Multilingual Setup", "Email Flows"],
            backendDepthOptions: ["Light (basic API + forms)", "Medium (dashboard + workflows)", "Advanced (integrations + automation)"],
          },
        },
      },
    ];

    for (const item of defaults) {
      await upsertLegacyPageContent(ctx, item.key, item.data);
      const bridge = LEGACY_SECTION_BRIDGE[item.key];
      if (bridge) {
        await upsertPageSection(ctx, {
          page: bridge.page,
          sectionKey: bridge.sectionKey,
          type: bridge.type,
          data: item.data,
          status: "published",
          order: 0,
        });
      }
    }

    const tokenDoc = await ctx.db
      .query("designTokens")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (!tokenDoc) {
      await ctx.db.insert("designTokens", {
        key: "global",
        data: DEFAULT_DESIGN_TOKENS,
        updatedAt: Date.now(),
      });
    }
  },
});
