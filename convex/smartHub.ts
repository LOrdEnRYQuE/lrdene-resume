import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";

const paidOrderLineItemValidator = v.object({
  shopifyLineItemGid: v.string(),
  shopifyProductGid: v.optional(v.string()),
  shopifyVariantGid: v.optional(v.string()),
  sku: v.string(),
  kind: v.string(),
  quantity: v.number(),
  deviceCount: v.number(),
  publicCodes: v.array(v.string()),
});

export const processPaidOrder = internalMutation({
  args: {
    deliveryId: v.string(),
    topic: v.string(),
    shopDomain: v.string(),
    shopifyOrderGid: v.string(),
    shopifyCustomerGid: v.string(),
    lineItems: v.array(paidOrderLineItemValidator),
  },
  handler: async (ctx, args) => {
    const duplicate = await ctx.db
      .query("smartWebhookReceipts")
      .withIndex("by_deliveryId", (q) => q.eq("deliveryId", args.deliveryId))
      .unique();

    if (duplicate) {
      return { duplicate: true, entitlementsCreated: 0, devicesCreated: 0 };
    }

    const now = Date.now();
    let workspace = await ctx.db
      .query("smartWorkspaces")
      .withIndex("by_shopifyCustomerGid", (q) =>
        q.eq("shopifyCustomerGid", args.shopifyCustomerGid),
      )
      .unique();

    let workspaceId;
    if (workspace) {
      workspaceId = workspace._id;
      await ctx.db.patch("smartWorkspaces", workspaceId, {
        status: "active",
        updatedAt: now,
      });
    } else {
      workspaceId = await ctx.db.insert("smartWorkspaces", {
        shopifyCustomerGid: args.shopifyCustomerGid,
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
      workspace = await ctx.db.get("smartWorkspaces", workspaceId);
    }

    let entitlementsCreated = 0;
    let devicesCreated = 0;

    for (const item of args.lineItems) {
      const existing = await ctx.db
        .query("smartEntitlements")
        .withIndex("by_shopifyOrderGid_and_shopifyLineItemGid", (q) =>
          q
            .eq("shopifyOrderGid", args.shopifyOrderGid)
            .eq("shopifyLineItemGid", item.shopifyLineItemGid),
        )
        .unique();

      if (existing) continue;

      const entitlementId = await ctx.db.insert("smartEntitlements", {
        workspaceId,
        shopifyOrderGid: args.shopifyOrderGid,
        shopifyLineItemGid: item.shopifyLineItemGid,
        shopifyProductGid: item.shopifyProductGid,
        shopifyVariantGid: item.shopifyVariantGid,
        sku: item.sku,
        kind: item.kind,
        quantity: item.quantity,
        deviceCount: item.deviceCount,
        status: item.kind === "contact_card" ? "active" : "pending_implementation",
        createdAt: now,
        updatedAt: now,
      });
      entitlementsCreated += 1;

      if (item.kind !== "contact_card") continue;

      for (const publicCode of item.publicCodes) {
        const profileId = await ctx.db.insert("smartProfiles", {
          workspaceId,
          entitlementId,
          kind: "contact_card",
          status: "configuration_required",
          createdAt: now,
          updatedAt: now,
        });

        await ctx.db.insert("smartDevices", {
          workspaceId,
          entitlementId,
          profileId,
          kind: "nfc_card",
          publicCode,
          status: "provisioned",
          shopifyOrderGid: args.shopifyOrderGid,
          shopifyProductGid: item.shopifyProductGid,
          shopifyVariantGid: item.shopifyVariantGid,
          createdAt: now,
          updatedAt: now,
        });
        devicesCreated += 1;
      }
    }

    await ctx.db.insert("smartWebhookReceipts", {
      deliveryId: args.deliveryId,
      topic: args.topic,
      shopDomain: args.shopDomain,
      shopifyOrderGid: args.shopifyOrderGid,
      status: "processed",
      createdAt: now,
    });

    return { duplicate: false, entitlementsCreated, devicesCreated };
  },
});

export const getCustomerHub = internalQuery({
  args: { shopifyCustomerGid: v.string() },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("smartWorkspaces")
      .withIndex("by_shopifyCustomerGid", (q) =>
        q.eq("shopifyCustomerGid", args.shopifyCustomerGid),
      )
      .unique();

    if (!workspace || workspace.status !== "active") {
      return { workspace: null, entitlements: [], profiles: [], devices: [] };
    }

    const [entitlements, profiles, devices] = await Promise.all([
      ctx.db
        .query("smartEntitlements")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspace._id))
        .take(100),
      ctx.db
        .query("smartProfiles")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspace._id))
        .take(100),
      ctx.db
        .query("smartDevices")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspace._id))
        .take(100),
    ]);

    return { workspace, entitlements, profiles, devices };
  },
});

export const updateContactProfile = internalMutation({
  args: {
    shopifyCustomerGid: v.string(),
    profileId: v.id("smartProfiles"),
    displayName: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    bookingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("smartWorkspaces")
      .withIndex("by_shopifyCustomerGid", (q) =>
        q.eq("shopifyCustomerGid", args.shopifyCustomerGid),
      )
      .unique();

    if (!workspace) throw new Error("Smart Workspace not found");

    const profile = await ctx.db.get("smartProfiles", args.profileId);
    if (!profile || profile.workspaceId !== workspace._id || profile.kind !== "contact_card") {
      throw new Error("Contact profile not found");
    }

    const {
      shopifyCustomerGid: _customer,
      profileId: _profileId,
      ...patch
    } = args;

    await ctx.db.patch("smartProfiles", args.profileId, {
      ...patch,
      status: "configured",
      updatedAt: Date.now(),
    });

    return await ctx.db.get("smartProfiles", args.profileId);
  },
});

export const getPublicContactCard = query({
  args: { publicCode: v.string() },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query("smartDevices")
      .withIndex("by_publicCode", (q) => q.eq("publicCode", args.publicCode))
      .unique();

    if (!device || device.status === "disabled") return null;

    const profile = await ctx.db.get("smartProfiles", device.profileId);
    if (!profile || profile.kind !== "contact_card") return null;

    return {
      publicCode: device.publicCode,
      deviceStatus: device.status,
      profile: {
        status: profile.status,
        displayName: profile.displayName,
        company: profile.company,
        role: profile.role,
        phone: profile.phone,
        email: profile.email,
        whatsapp: profile.whatsapp,
        website: profile.website,
        address: profile.address,
        photoUrl: profile.photoUrl,
        instagram: profile.instagram,
        facebook: profile.facebook,
        tiktok: profile.tiktok,
        linkedin: profile.linkedin,
        bookingUrl: profile.bookingUrl,
      },
    };
  },
});


export const processLifecycleWebhook = internalMutation({
  args: {
    deliveryId: v.string(),
    topic: v.string(),
    shopDomain: v.string(),
    shopifyCustomerGid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("smartWebhookReceipts")
      .withIndex("by_deliveryId", (q) => q.eq("deliveryId", args.deliveryId))
      .unique();

    if (existing) return { duplicate: true, action: existing.status };

    let status = "processed";
    if (args.topic === "customers/redact" && args.shopifyCustomerGid) {
      const workspace = await ctx.db
        .query("smartWorkspaces")
        .withIndex("by_shopifyCustomerGid", (q) =>
          q.eq("shopifyCustomerGid", args.shopifyCustomerGid!),
        )
        .unique();

      if (workspace) {
        await ctx.db.patch("smartWorkspaces", workspace._id, {
          status: "deleting",
          updatedAt: Date.now(),
        });
        await ctx.scheduler.runAfter(0, internal.smartHub.redactWorkspaceBatch, {
          workspaceId: workspace._id,
        });
        status = "redaction_scheduled";
      }
    }

    if (args.topic === "shop/redact") {
      await ctx.scheduler.runAfter(0, internal.smartHub.redactShopBatch, {});
      status = "redaction_scheduled";
    }

    await ctx.db.insert("smartWebhookReceipts", {
      deliveryId: args.deliveryId,
      topic: args.topic,
      shopDomain: args.shopDomain,
      shopifyCustomerGid: args.shopifyCustomerGid,
      status,
      createdAt: Date.now(),
    });

    return { duplicate: false, action: status };
  },
});

export const redactWorkspaceBatch = internalMutation({
  args: { workspaceId: v.id("smartWorkspaces") },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get("smartWorkspaces", args.workspaceId);
    if (!workspace) return { done: true };

    const [events, devices, profiles, entitlements] = await Promise.all([
      ctx.db
        .query("smartEvents")
        .withIndex("by_workspaceId_and_timestamp", (q) => q.eq("workspaceId", args.workspaceId))
        .take(50),
      ctx.db
        .query("smartDevices")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
        .take(50),
      ctx.db
        .query("smartProfiles")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
        .take(50),
      ctx.db
        .query("smartEntitlements")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
        .take(50),
    ]);

    for (const row of events) await ctx.db.delete("smartEvents", row._id);
    for (const row of devices) await ctx.db.delete("smartDevices", row._id);
    for (const row of profiles) await ctx.db.delete("smartProfiles", row._id);
    for (const row of entitlements) await ctx.db.delete("smartEntitlements", row._id);

    const more =
      events.length === 50 ||
      devices.length === 50 ||
      profiles.length === 50 ||
      entitlements.length === 50;

    if (more) {
      await ctx.scheduler.runAfter(0, internal.smartHub.redactWorkspaceBatch, {
        workspaceId: args.workspaceId,
      });
      return { done: false };
    }

    await ctx.db.delete("smartWorkspaces", args.workspaceId);
    return { done: true };
  },
});

export const redactShopBatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const active = await ctx.db
      .query("smartWorkspaces")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .take(20);
    const suspended = await ctx.db
      .query("smartWorkspaces")
      .withIndex("by_status", (q) => q.eq("status", "suspended"))
      .take(20);
    const batch = [...active, ...suspended].slice(0, 20);

    if (batch.length === 0) {
      await ctx.scheduler.runAfter(0, internal.smartHub.redactWebhookReceiptsBatch, {});
      return { done: true };
    }

    for (const workspace of batch) {
      await ctx.db.patch("smartWorkspaces", workspace._id, {
        status: "deleting",
        updatedAt: Date.now(),
      });
      await ctx.scheduler.runAfter(0, internal.smartHub.redactWorkspaceBatch, {
        workspaceId: workspace._id,
      });
    }

    await ctx.scheduler.runAfter(50, internal.smartHub.redactShopBatch, {});
    return { done: false, scheduled: batch.length };
  },
});


export const redactWebhookReceiptsBatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const receipts = await ctx.db.query("smartWebhookReceipts").take(100);
    for (const receipt of receipts) {
      await ctx.db.delete("smartWebhookReceipts", receipt._id);
    }

    if (receipts.length === 100) {
      await ctx.scheduler.runAfter(0, internal.smartHub.redactWebhookReceiptsBatch, {});
      return { done: false };
    }

    return { done: true };
  },
});
