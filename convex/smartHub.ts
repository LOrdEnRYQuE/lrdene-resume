import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

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
      if (workspace.status === "deleting") {
        throw new Error("Smart Workspace is being deleted; retry later");
      }
      workspaceId = workspace._id;
      if (workspace.status !== "active") {
        await ctx.db.patch("smartWorkspaces", workspaceId, {
          status: "active",
          updatedAt: now,
        });
      }
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
      return { workspace: null, entitlements: [], profiles: [], devices: [], stats: [] };
    }

    const [entitlements, profiles, devices, stats] = await Promise.all([
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
      ctx.db
        .query("smartDeviceStats")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspace._id))
        .take(100),
    ]);

    const profilesWithMedia = await Promise.all(
      profiles.map(async (profile) => {
        const storedPhotoUrl = profile.photoStorageId
          ? await ctx.storage.getUrl(profile.photoStorageId)
          : null;
        return {
          ...profile,
          photoUrl: storedPhotoUrl ?? profile.photoUrl,
        };
      }),
    );

    return { workspace, entitlements, profiles: profilesWithMedia, devices, stats };
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

    if (!workspace || workspace.status !== "active") throw new Error("Smart Workspace not found");

    const profile = await ctx.db.get("smartProfiles", args.profileId);
    if (!profile || profile.workspaceId !== workspace._id || profile.kind !== "contact_card") {
      throw new Error("Contact profile not found");
    }

    const {
      shopifyCustomerGid: _customer,
      profileId: _profileId,
      ...patch
    } = args;
    void _customer;
    void _profileId;

    const devices = await ctx.db
      .query("smartDevices")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .take(20);

    const productionLocked = devices.some(
      (device) => device.status === "programmed" || device.status === "shipped",
    );

    const now = Date.now();
    await ctx.db.patch("smartProfiles", args.profileId, {
      ...patch,
      status: productionLocked ? "approved" : "configured",
      updatedAt: now,
    });

    if (!productionLocked) {
      for (const device of devices) {
        if (device.status === "approved") {
          await ctx.db.patch("smartDevices", device._id, {
            status: "provisioned",
            updatedAt: now,
          });
        }
      }
    }

    return await ctx.db.get("smartProfiles", args.profileId);
  },
});

export const setContactProfilePhoto = internalMutation({
  args: {
    shopifyCustomerGid: v.string(),
    profileId: v.id("smartProfiles"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("smartWorkspaces")
      .withIndex("by_shopifyCustomerGid", (q) =>
        q.eq("shopifyCustomerGid", args.shopifyCustomerGid),
      )
      .unique();

    if (!workspace || workspace.status !== "active") {
      throw new Error("Smart Workspace not found");
    }

    const profile = await ctx.db.get("smartProfiles", args.profileId);
    if (!profile || profile.workspaceId !== workspace._id || profile.kind !== "contact_card") {
      throw new Error("Contact profile not found");
    }

    const devices = await ctx.db
      .query("smartDevices")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .take(20);

    const productionLocked = devices.some(
      (device) => device.status === "programmed" || device.status === "shipped",
    );
    const oldStorageId = profile.photoStorageId;
    const now = Date.now();

    await ctx.db.patch("smartProfiles", args.profileId, {
      photoStorageId: args.storageId,
      photoUrl: undefined,
      status: productionLocked ? "approved" : "configured",
      updatedAt: now,
    });

    if (!productionLocked) {
      for (const device of devices) {
        if (device.status === "approved") {
          await ctx.db.patch("smartDevices", device._id, {
            status: "provisioned",
            updatedAt: now,
          });
        }
      }
    }

    if (oldStorageId && oldStorageId !== args.storageId) {
      await ctx.storage.delete(oldStorageId);
    }

    return { profileId: args.profileId, storageId: args.storageId };
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

    const storedPhotoUrl = profile.photoStorageId
      ? await ctx.storage.getUrl(profile.photoStorageId)
      : null;

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
        photoUrl: storedPhotoUrl ?? profile.photoUrl,
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

    if (args.topic === "customers/redact" && args.shopifyCustomerGid) {
      await ctx.scheduler.runAfter(0, internal.smartHub.redactCustomerReceiptsBatch, {
        shopifyCustomerGid: args.shopifyCustomerGid,
      });
    }

    return { duplicate: false, action: status };
  },
});

export const redactWorkspaceBatch = internalMutation({
  args: { workspaceId: v.id("smartWorkspaces") },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get("smartWorkspaces", args.workspaceId);
    if (!workspace) return { done: true };

    const [events, stats, devices, profiles, entitlements] = await Promise.all([
      ctx.db
        .query("smartEvents")
        .withIndex("by_workspaceId_and_timestamp", (q) => q.eq("workspaceId", args.workspaceId))
        .take(50),
      ctx.db
        .query("smartDeviceStats")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
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
    for (const row of stats) await ctx.db.delete("smartDeviceStats", row._id);
    for (const row of devices) await ctx.db.delete("smartDevices", row._id);
    for (const row of profiles) {
      if (row.photoStorageId) await ctx.storage.delete(row.photoStorageId);
      await ctx.db.delete("smartProfiles", row._id);
    }
    for (const row of entitlements) await ctx.db.delete("smartEntitlements", row._id);

    const more =
      events.length === 50 ||
      stats.length === 50 ||
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


export const recordPublicInteraction = mutation({
  args: {
    publicCode: v.string(),
    type: v.union(v.literal("tap"), v.literal("vcard_download")),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query("smartDevices")
      .withIndex("by_publicCode", (q) => q.eq("publicCode", args.publicCode))
      .unique();

    if (!device || device.status === "disabled") return { recorded: false };

    const now = Date.now();
    await ctx.db.insert("smartEvents", {
      workspaceId: device.workspaceId,
      deviceId: device._id,
      publicCode: device.publicCode,
      type: args.type,
      timestamp: now,
      referrer: args.referrer?.slice(0, 500),
    });

    const stats = await ctx.db
      .query("smartDeviceStats")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", device._id))
      .unique();

    if (stats) {
      await ctx.db.patch("smartDeviceStats", stats._id, {
        taps: stats.taps + (args.type === "tap" ? 1 : 0),
        vcardDownloads:
          stats.vcardDownloads + (args.type === "vcard_download" ? 1 : 0),
        lastInteractionAt: now,
      });
    } else {
      await ctx.db.insert("smartDeviceStats", {
        workspaceId: device.workspaceId,
        deviceId: device._id,
        taps: args.type === "tap" ? 1 : 0,
        vcardDownloads: args.type === "vcard_download" ? 1 : 0,
        lastInteractionAt: now,
      });
    }

    return { recorded: true };
  },
});


export const approveContactProfile = internalMutation({
  args: {
    shopifyCustomerGid: v.string(),
    profileId: v.id("smartProfiles"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("smartWorkspaces")
      .withIndex("by_shopifyCustomerGid", (q) =>
        q.eq("shopifyCustomerGid", args.shopifyCustomerGid),
      )
      .unique();

    if (!workspace || workspace.status !== "active") {
      throw new Error("Smart Workspace not found");
    }

    const profile = await ctx.db.get("smartProfiles", args.profileId);
    if (
      !profile ||
      profile.workspaceId !== workspace._id ||
      profile.kind !== "contact_card"
    ) {
      throw new Error("Contact profile not found");
    }

    if (profile.status !== "configured" && profile.status !== "approved") {
      throw new Error("Complete the contact-card configuration before approval");
    }

    const devices = await ctx.db
      .query("smartDevices")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .take(20);

    const now = Date.now();
    await ctx.db.patch("smartProfiles", args.profileId, {
      status: "approved",
      updatedAt: now,
    });

    for (const device of devices) {
      if (device.status === "provisioned" || device.status === "approved") {
        await ctx.db.patch("smartDevices", device._id, {
          status: "approved",
          updatedAt: now,
        });
      }
    }

    return { profileId: args.profileId, approved: true, deviceCount: devices.length };
  },
});


export const listProductionQueue = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);

    const statuses = ["provisioned", "approved", "programmed", "shipped"] as const;
    const batches = await Promise.all(
      statuses.map((status) =>
        ctx.db
          .query("smartDevices")
          .withIndex("by_status", (q) => q.eq("status", status))
          .order("desc")
          .take(25),
      ),
    );

    const devices = batches.flat();
    const smartLinkBaseUrl = (
      process.env.SMART_LINK_BASE_URL ?? "https://lordenryque.com/go"
    ).replace(/\/$/, "");

    const rows = [];
    for (const device of devices) {
      const [profile, entitlement, workspace, stats] = await Promise.all([
        ctx.db.get("smartProfiles", device.profileId),
        ctx.db.get("smartEntitlements", device.entitlementId),
        ctx.db.get("smartWorkspaces", device.workspaceId),
        ctx.db
          .query("smartDeviceStats")
          .withIndex("by_deviceId", (q) => q.eq("deviceId", device._id))
          .unique(),
      ]);

      rows.push({
        device,
        profile,
        entitlement,
        workspace,
        stats,
        publicUrl: `${smartLinkBaseUrl}/${encodeURIComponent(device.publicCode)}`,
      });
    }

    rows.sort((a, b) => b.device.updatedAt - a.device.updatedAt);
    return rows;
  },
});

export const updateDeviceProduction = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    deviceId: v.id("smartDevices"),
    status: v.union(
      v.literal("programmed"),
      v.literal("shipped"),
      v.literal("disabled"),
    ),
    nfcUid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);

    const device = await ctx.db.get("smartDevices", args.deviceId);
    if (!device) throw new Error("Smart device not found");

    if (args.status === "programmed" && device.status !== "approved") {
      throw new Error("Only an approved device can be marked as programmed");
    }
    if (args.status === "shipped" && device.status !== "programmed") {
      throw new Error("Only a programmed device can be marked as shipped");
    }

    const patch: {
      status: string;
      updatedAt: number;
      nfcUid?: string;
    } = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.nfcUid !== undefined) {
      const normalized = args.nfcUid.trim();
      if (normalized.length > 128) throw new Error("NFC UID is too long");
      patch.nfcUid = normalized || undefined;
    }

    await ctx.db.patch("smartDevices", args.deviceId, patch);
    return await ctx.db.get("smartDevices", args.deviceId);
  },
});


export const redactCustomerReceiptsBatch = internalMutation({
  args: { shopifyCustomerGid: v.string() },
  handler: async (ctx, args) => {
    const receipts = await ctx.db
      .query("smartWebhookReceipts")
      .withIndex("by_shopifyCustomerGid", (q) =>
        q.eq("shopifyCustomerGid", args.shopifyCustomerGid),
      )
      .take(100);

    for (const receipt of receipts) {
      await ctx.db.patch("smartWebhookReceipts", receipt._id, {
        shopifyCustomerGid: undefined,
        shopifyOrderGid: undefined,
        status: "redacted",
      });
    }

    if (receipts.length === 100) {
      await ctx.scheduler.runAfter(0, internal.smartHub.redactCustomerReceiptsBatch, {
        shopifyCustomerGid: args.shopifyCustomerGid,
      });
      return { done: false };
    }

    return { done: true };
  },
});
