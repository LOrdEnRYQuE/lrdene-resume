import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";
import type { Id } from "./_generated/dataModel";

const PORTAL_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const RATE_LIMIT_BLOCK_MS = 30 * 60 * 1000;
const MAX_PORTALS = 500;
const MAX_PORTAL_ASSETS = 300;
const MAX_PORTAL_MESSAGES = 100;
const PORTAL_STATUS = v.union(
  v.literal("active"),
  v.literal("on-hold"),
  v.literal("completed"),
  v.literal("revoked"),
);

const generateSegment = () => {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => PORTAL_CODE_CHARSET[b % PORTAL_CODE_CHARSET.length]).join("");
};

async function allocatePortalCode(ctx: QueryCtx | MutationCtx) {
  for (let i = 0; i < 8; i++) {
    const candidate = `CP-${generateSegment()}-${generateSegment()}`;
    const existing = await ctx.db
      .query("clientPortals")
      .withIndex("by_secretCode", (q) => q.eq("secretCode", candidate))
      .unique();
    if (!existing) {
      return candidate;
    }
  }
  throw new Error("Failed to allocate unique portal code");
}

async function requirePortalCodeAccess(
  ctx: QueryCtx | MutationCtx,
  portalId: Id<"clientPortals">,
  code: string | undefined,
) {
  if (!code) {
    throw new Error("Portal code is required.");
  }
  const portal = await ctx.db.get(portalId);
  if (!portal || portal.secretCode !== code) {
    throw new Error("Invalid portal access.");
  }
  if (portal.status !== "active") {
    throw new Error("Portal is currently unavailable.");
  }
}

/**
 * Creates a new client portal for a lead.
 */
export const createPortal = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    leadId: v.id("leads"),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const secretCode = await allocatePortalCode(ctx);

    const portalId = await ctx.db.insert("clientPortals", {
      leadId: args.leadId,
      projectId: args.projectId,
      secretCode,
      status: "active",
    });

    return { portalId, secretCode };
  },
});

export const validatePortalAccess = mutation({
  args: {
    code: v.string(),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const attempt = await ctx.db
      .query("portalAccessAttempts")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprint", args.fingerprint))
      .unique();

    let attempts = 0;
    let windowStart = now;
    let blockedUntil: number | undefined = undefined;

    if (attempt) {
      attempts = attempt.attempts;
      windowStart = attempt.windowStart;
      blockedUntil = attempt.blockedUntil;
      if (blockedUntil && blockedUntil > now) {
        return { ok: false as const, error: "Too many attempts. Please try again later." };
      }
      if (now - windowStart > RATE_LIMIT_WINDOW_MS) {
        attempts = 0;
        windowStart = now;
      }
    }

    const portal = await ctx.db
      .query("clientPortals")
      .withIndex("by_secretCode", (q) => q.eq("secretCode", args.code))
      .unique();

    if (!portal) {
      const nextAttempts = attempts + 1;
      const nextBlockedUntil =
        nextAttempts >= RATE_LIMIT_MAX_ATTEMPTS ? now + RATE_LIMIT_BLOCK_MS : undefined;

      if (attempt) {
        await ctx.db.patch(attempt._id, {
          attempts: nextAttempts,
          windowStart,
          lastAttempt: now,
          blockedUntil: nextBlockedUntil,
        });
      } else {
        await ctx.db.insert("portalAccessAttempts", {
          fingerprint: args.fingerprint,
          attempts: nextAttempts,
          windowStart,
          lastAttempt: now,
          blockedUntil: nextBlockedUntil,
        });
      }

      return { ok: false as const, error: "Invalid or expired portal code." };
    }
    if (portal.status !== "active") {
      return { ok: false as const, error: "Portal is currently unavailable." };
    }

    if (attempt) {
      await ctx.db.patch(attempt._id, {
        attempts: 0,
        windowStart: now,
        lastAttempt: now,
        blockedUntil: undefined,
      });
    } else {
      await ctx.db.insert("portalAccessAttempts", {
        fingerprint: args.fingerprint,
        attempts: 0,
        windowStart: now,
        lastAttempt: now,
        blockedUntil: undefined,
      });
    }

    const lead = await ctx.db.get(portal.leadId);
    const project = portal.projectId ? await ctx.db.get(portal.projectId) : null;

    return {
      ok: true as const,
      portal: {
        ...portal,
        clientName: lead?.name,
        projectTitle: project?.title || "Untitled Project",
        projectStatus: project?.status || "In Planning",
      },
    };
  },
});

/**
 * Validates a portal code and returns portal details.
 */
export const validateCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const portal = await ctx.db
      .query("clientPortals")
      .withIndex("by_secretCode", (q) => q.eq("secretCode", args.code))
      .unique();

    if (!portal) return null;
    if (portal.status !== "active") return null;

    const lead = await ctx.db.get(portal.leadId);
    const project = portal.projectId ? await ctx.db.get(portal.projectId) : null;
    const messages = await ctx.db
      .query("portalMessages")
      .withIndex("by_portalId", (q) => q.eq("portalId", portal._id))
      .order("desc")
      .take(50);

    return {
      ...portal,
      clientName: lead?.name,
      projectTitle: project?.title || "Untitled Project",
      projectStatus: project?.status || "In Planning",
      messages,
    };
  },
});

/**
 * Adds a message to the portal.
 */
export const addMessage = mutation({
  args: {
    adminToken: v.optional(ADMIN_TOKEN),
    code: v.optional(v.string()),
    portalId: v.id("clientPortals"),
    author: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.adminToken) {
      await requireAdminToken(args.adminToken);
    } else {
      await requirePortalCodeAccess(ctx, args.portalId, args.code);
    }

    await ctx.db.insert("portalMessages", {
      portalId: args.portalId,
      author: args.author,
      content: args.content,
      timestamp: Date.now(),
    });

    await ctx.db.patch(args.portalId, { lastAccessed: Date.now() });
  },
});

/**
 * Lists all active portals for admin.
 */
export const listPortals = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const portals = await ctx.db.query("clientPortals").order("desc").take(MAX_PORTALS);
    return Promise.all(
      portals.map(async (p) => {
        const lead = await ctx.db.get(p.leadId);
        const project = p.projectId ? await ctx.db.get(p.projectId) : null;
        return { ...p, clientName: lead?.name, clientEmail: lead?.email, projectTitle: project?.title };
      })
    );
  },
});

export const updatePortalStatus = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    portalId: v.id("clientPortals"),
    status: PORTAL_STATUS,
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.portalId, { status: args.status });
  },
});

export const rotatePortalCode = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    portalId: v.id("clientPortals"),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const portal = await ctx.db.get(args.portalId);
    if (!portal) {
      throw new Error("Portal not found.");
    }
    const nextCode = await allocatePortalCode(ctx);
    await ctx.db.patch(args.portalId, {
      secretCode: nextCode,
      status: portal.status === "revoked" ? "active" : portal.status,
    });
    return { secretCode: nextCode };
  },
});

/**
 * Generates an upload URL for portal assets.
 */
export const generateUploadUrl = mutation({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Adds an asset to a portal.
 */
export const addPortalAsset = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    portalId: v.id("clientPortals"),
    storageId: v.id("_storage"),
    name: v.string(),
    format: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const assetId = await ctx.db.insert("portalAssets", {
      portalId: args.portalId,
      storageId: args.storageId,
      name: args.name,
      format: args.format,
      status: "pending",
      createdAt: Date.now(),
    });
    return assetId;
  },
});

/**
 * Updates the status of an asset.
 */
export const updateAssetStatus = mutation({
  args: {
    adminToken: v.optional(ADMIN_TOKEN),
    code: v.optional(v.string()),
    assetId: v.id("portalAssets"),
    status: v.string(),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const asset = await ctx.db.get(args.assetId);
    if (!asset) {
      throw new Error("Asset not found.");
    }

    if (args.adminToken) {
      await requireAdminToken(args.adminToken);
    } else {
      await requirePortalCodeAccess(ctx, asset.portalId, args.code);
    }

    await ctx.db.patch(args.assetId, {
      status: args.status,
      feedback: args.feedback,
    });
  },
});

/**
 * Retrieves assets for a portal.
 */
export const getPortalAssets = query({
  args: {
    adminToken: v.optional(ADMIN_TOKEN),
    code: v.optional(v.string()),
    portalId: v.id("clientPortals"),
  },
  handler: async (ctx, args) => {
    if (args.adminToken) {
      await requireAdminToken(args.adminToken);
    } else {
      await requirePortalCodeAccess(ctx, args.portalId, args.code);
    }

    const assets = await ctx.db
      .query("portalAssets")
      .withIndex("by_portalId", (q) => q.eq("portalId", args.portalId))
      .order("desc")
      .take(MAX_PORTAL_ASSETS);

    return Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        url: await ctx.storage.getUrl(asset.storageId),
      }))
    );
  },
});

export const getPortalMessages = query({
  args: {
    adminToken: v.optional(ADMIN_TOKEN),
    code: v.optional(v.string()),
    portalId: v.id("clientPortals"),
  },
  handler: async (ctx, args) => {
    if (args.adminToken) {
      await requireAdminToken(args.adminToken);
    } else {
      await requirePortalCodeAccess(ctx, args.portalId, args.code);
    }

    return await ctx.db
      .query("portalMessages")
      .withIndex("by_portalId", (q) => q.eq("portalId", args.portalId))
      .order("desc")
      .take(MAX_PORTAL_MESSAGES);
  },
});
