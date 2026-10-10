import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { createSmartPublicCode, isExpectedShopDomain, verifyShopifySessionToken, verifyShopifyWebhook } from "./shopifyAuth";
import { parseOrderPersonalization } from "./orderPersonalization";

const http = httpRouter();

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function pickEventType(payload: Record<string, unknown>): string {
  return (
    asString(payload.type) ??
    asString(payload.event) ??
    asString((payload as { data?: { type?: string } }).data?.type) ??
    "unknown"
  );
}

function pickMessageId(payload: Record<string, unknown>): string | undefined {
  const data = (payload.data ?? {}) as Record<string, unknown>;
  return (
    asString(data.email_id) ??
    asString(data.id) ??
    asString(data.message_id) ??
    asString(payload.message_id) ??
    asString(payload.id)
  );
}

function pickTo(payload: Record<string, unknown>): string | undefined {
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const to = data.to ?? payload.to;
  if (Array.isArray(to)) {
    const first = to.find((x) => typeof x === "string");
    return typeof first === "string" ? first : undefined;
  }
  return asString(to);
}

function pickFrom(payload: Record<string, unknown>): string | undefined {
  const data = (payload.data ?? {}) as Record<string, unknown>;
  return asString(data.from) ?? asString(payload.from);
}

function pickSubject(payload: Record<string, unknown>): string | undefined {
  const data = (payload.data ?? {}) as Record<string, unknown>;
  return asString(data.subject) ?? asString(payload.subject);
}

function pickText(payload: Record<string, unknown>): string | undefined {
  const data = (payload.data ?? {}) as Record<string, unknown>;
  return asString(data.text) ?? asString(data.html) ?? asString(payload.text);
}

http.route({
  path: "/webhooks/resend",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const settings = await ctx.runQuery(internal.settings.getInternal, {});
    const configuredSecret = process.env.RESEND_WEBHOOK_SECRET ?? settings?.emailConfig?.webhookSecret;
    if (configuredSecret) {
      const incomingSecret = req.headers.get("x-webhook-secret");
      if (incomingSecret !== configuredSecret) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    let payload: Record<string, unknown>;
    try {
      payload = (await req.json()) as Record<string, unknown>;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const eventType = pickEventType(payload);
    const result = await ctx.runMutation(api.communications.ingestProviderWebhookEvent, {
      provider: "resend",
      eventType,
      messageId: pickMessageId(payload),
      from: pickFrom(payload),
      to: pickTo(payload),
      subject: pickSubject(payload),
      text: pickText(payload),
      timestamp: asNumber((payload.data as Record<string, unknown> | undefined)?.created_at),
      payload: JSON.stringify(payload),
    });

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }),
});


const SMART_KIND_BY_SKU_PREFIX: Array<[string, string]> = [
  ["LRD-SMART-CONTACT-", "contact_card"],
  ["LRD-SMART-REVIEW-STAND-", "review_stand"],
  ["LRD-SMART-REVIEW-CARD-", "review_card"],
  ["LRD-SMART-KIT-", "business_kit"],
  ["LRD-SMART-SOCIAL-", "social"],
  ["LRD-SMART-WIFI-", "wifi"],
  ["LRD-SMART-MENU-", "menu_booking"],
  ["LRD-SMART-GROWTH-", "growth_kit"],
  ["LRD-SMART-HOSP-", "hospitality_kit"],
];

function smartKindFromSku(sku: string): string | null {
  return SMART_KIND_BY_SKU_PREFIX.find(([prefix]) => sku.startsWith(prefix))?.[1] ?? null;
}

function contactCardPackSize(sku: string): number {
  const match = sku.match(/^LRD-SMART-CONTACT-(1|3|5)$/);
  return match ? Number(match[1]) : 0;
}

function physicalDeviceCount(kind: string, sku: string, quantity: number): number {
  if (kind === "contact_card") return contactCardPackSize(sku) * quantity;
  if (kind === "review_card") {
    const match = sku.match(/^LRD-SMART-REVIEW-CARD-(1|3|5)$/);
    return (match ? Number(match[1]) : 1) * quantity;
  }
  if (kind === "business_kit") return 3 * quantity;
  if (kind === "growth_kit") return 3 * quantity;
  if (kind === "hospitality_kit") return 3 * quantity;
  return quantity;
}

function shopifyGid(type: "Order" | "Customer" | "LineItem" | "Product" | "ProductVariant", id: unknown): string | undefined {
  if (typeof id === "string" && id.startsWith("gid://shopify/")) return id;
  if ((typeof id === "string" && /^\d+$/.test(id)) || typeof id === "number") {
    return `gid://shopify/${type}/${id}`;
  }
  return undefined;
}

function isAllowedProfileImage(blob: Blob, bytes: Uint8Array): boolean {
  if (blob.size === 0 || blob.size > 5 * 1024 * 1024) return false;

  const jpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;
  const png =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const webp =
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  return jpeg || png || webp;
}

function corsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "authorization, content-type",
    "access-control-allow-methods": "GET, PATCH, OPTIONS",
    "content-type": "application/json",
  };
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status, headers: corsHeaders() });
}

async function authenticatedShopifyCustomer(req: Request): Promise<string> {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("Missing Shopify session token");
  const claims = await verifyShopifySessionToken(authorization.slice("Bearer ".length));
  if (!claims.sub) throw new Error("Authenticated Shopify customer is required");
  return claims.sub;
}

http.route({
  path: "/smart-hub/customer",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

http.route({
  path: "/smart-hub/customer",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    try {
      const shopifyCustomerGid = await authenticatedShopifyCustomer(req);
      const hub = await ctx.runQuery(internal.smartHub.getCustomerHub, { shopifyCustomerGid });
      const smartLinkBaseUrl = (
        process.env.SMART_LINK_BASE_URL ?? "https://lordenryque.com/go"
      ).replace(/\/$/, "");
      return jsonResponse({
        ok: true,
        hub: {
          ...hub,
          devices: hub.devices.map((device) => ({
            ...device,
            publicUrl: `${smartLinkBaseUrl}/${encodeURIComponent(device.publicCode)}`,
          })),
        },
      });
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Unauthorized" },
        401,
      );
    }
  }),
});

http.route({
  path: "/smart-hub/contact",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

http.route({
  path: "/smart-hub/contact",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    let shopifyCustomerGid: string;
    try {
      shopifyCustomerGid = await authenticatedShopifyCustomer(req);
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Unauthorized" },
        401,
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
    }

    if (typeof body.profileId !== "string") {
      return jsonResponse({ ok: false, error: "profileId is required" }, 400);
    }

    const optionalText = (key: string): string | undefined => {
      const value = body[key];
      if (value === undefined || value === null || value === "") return undefined;
      if (typeof value !== "string") throw new Error(`${key} must be a string`);
      const trimmed = value.trim();
      if (trimmed.length > 500) throw new Error(`${key} is too long`);
      return trimmed;
    };

    try {
      const profile = await ctx.runMutation(internal.smartHub.updateContactProfile, {
        shopifyCustomerGid,
        profileId: body.profileId as Id<"smartProfiles">,
        displayName: optionalText("displayName"),
        company: optionalText("company"),
        role: optionalText("role"),
        phone: optionalText("phone"),
        email: optionalText("email"),
        whatsapp: optionalText("whatsapp"),
        website: optionalText("website"),
        address: optionalText("address"),
        photoUrl: optionalText("photoUrl"),
        instagram: optionalText("instagram"),
        facebook: optionalText("facebook"),
        tiktok: optionalText("tiktok"),
        linkedin: optionalText("linkedin"),
        bookingUrl: optionalText("bookingUrl"),
      });
      return jsonResponse({ ok: true, profile });
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Profile update failed" },
        400,
      );
    }
  }),
});



http.route({
  path: "/smart-hub/contact/photo",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

http.route({
  path: "/smart-hub/contact/photo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    let shopifyCustomerGid: string;
    try {
      shopifyCustomerGid = await authenticatedShopifyCustomer(req);
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Unauthorized" },
        401,
      );
    }

    const profileId = new URL(req.url).searchParams.get("profileId");
    if (!profileId) {
      return jsonResponse({ ok: false, error: "profileId is required" }, 400);
    }

    const contentType = (req.headers.get("content-type") ?? "").toLowerCase();
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(contentType)) {
      return jsonResponse(
        { ok: false, error: "Only JPG, PNG, and WebP images are supported" },
        415,
      );
    }

    const blob = await req.blob();
    const signature = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    if (!isAllowedProfileImage(blob, signature)) {
      return jsonResponse(
        { ok: false, error: "Invalid image or file is larger than 5 MB" },
        400,
      );
    }

    const storageId = await ctx.storage.store(blob);
    try {
      await ctx.runMutation(internal.smartHub.setContactProfilePhoto, {
        shopifyCustomerGid,
        profileId: profileId as Id<"smartProfiles">,
        storageId,
      });
      const photoUrl = await ctx.storage.getUrl(storageId);
      return jsonResponse({ ok: true, photoUrl });
    } catch (error) {
      await ctx.storage.delete(storageId);
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Photo upload failed" },
        400,
      );
    }
  }),
});

http.route({
  path: "/smart-hub/contact/approve",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

http.route({
  path: "/smart-hub/contact/approve",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    let shopifyCustomerGid: string;
    try {
      shopifyCustomerGid = await authenticatedShopifyCustomer(req);
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Unauthorized" },
        401,
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
    }

    if (typeof body.profileId !== "string") {
      return jsonResponse({ ok: false, error: "profileId is required" }, 400);
    }

    try {
      const result = await ctx.runMutation(internal.smartHub.approveContactProfile, {
        shopifyCustomerGid,
        profileId: body.profileId as Id<"smartProfiles">,
      });
      return jsonResponse({ ok: true, result });
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Approval failed" },
        400,
      );
    }
  }),
});

http.route({
  path: "/webhooks/shopify/orders-paid",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const signature = req.headers.get("x-shopify-hmac-sha256");
    const deliveryId = req.headers.get("x-shopify-webhook-id");
    const topic = req.headers.get("x-shopify-topic") ?? "";
    const shopDomain = req.headers.get("x-shopify-shop-domain") ?? "";

    if (!signature || !deliveryId || !shopDomain) {
      return new Response("Missing Shopify webhook headers", { status: 400 });
    }
    if (!isExpectedShopDomain(shopDomain)) {
      return new Response("Unexpected Shopify shop", { status: 401 });
    }

    const rawBody = await req.text();
    if (!(await verifyShopifyWebhook(rawBody, signature))) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (topic !== "orders/paid") {
      return new Response("Ignored", { status: 200 });
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const orderGid = shopifyGid("Order", payload.admin_graphql_api_id ?? payload.id);
    const customer = (payload.customer ?? {}) as Record<string, unknown>;
    const customerGid = shopifyGid("Customer", customer.admin_graphql_api_id ?? customer.id);
    const lineItemsRaw = Array.isArray(payload.line_items) ? payload.line_items : [];

    if (!orderGid) {
      return new Response("Order has no Shopify order ID", { status: 400 });
    }

    // Guest checkout is currently enabled in Shopify. Preserve smart-item
    // orders for manual account assignment rather than silently acknowledging
    // payment without creating any entitlement or production record.
    if (!customerGid) {
      const smartItems = lineItemsRaw
        .filter((rawItem): rawItem is Record<string, unknown> =>
          Boolean(rawItem && typeof rawItem === "object"))
        .map((item) => {
          const sku = typeof item.sku === "string" ? item.sku.trim() : "";
          const kind = smartKindFromSku(sku);
          return kind ? {
            sku,
            kind,
            quantity: typeof item.quantity === "number" && item.quantity > 0
              ? Math.floor(item.quantity) : 1,
          } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
      if (smartItems.length === 0) {
        return new Response("No Smart Business items", { status: 200 });
      }
      const pending = await ctx.runMutation(internal.smartHub.recordPendingCustomerOrder, {
        shopifyOrderGid: orderGid,
        shopDomain,
        deliveryId,
        lineItems: smartItems,
      });
      return jsonResponse({ ok: true, customerAssignmentRequired: true, pending });
    }

    const lineItems = [];
    for (const rawItem of lineItemsRaw) {
      if (!rawItem || typeof rawItem !== "object") continue;
      const item = rawItem as Record<string, unknown>;
      const sku = typeof item.sku === "string" ? item.sku.trim() : "";
      const kind = smartKindFromSku(sku);
      const quantity = typeof item.quantity === "number" && item.quantity > 0
        ? Math.floor(item.quantity)
        : 1;
      if (!kind) continue;

      const lineItemGid = shopifyGid("LineItem", item.admin_graphql_api_id ?? item.id);
      if (!lineItemGid) continue;

      const deviceCount = physicalDeviceCount(kind, sku, quantity);
      const publicCodes: string[] = [];
      if (kind === "contact_card") {
        for (let index = 0; index < deviceCount; index += 1) {
          publicCodes.push(
            await createSmartPublicCode(`${shopDomain}:${orderGid}:${lineItemGid}:${index}`),
          );
        }
      }

      lineItems.push({
        shopifyLineItemGid: lineItemGid,
        shopifyProductGid: shopifyGid("Product", item.product_id),
        shopifyVariantGid: shopifyGid("ProductVariant", item.variant_id),
        sku,
        kind,
        quantity,
        deviceCount,
        publicCodes,
        personalization: parseOrderPersonalization(item.properties),
      });
    }

    if (lineItems.length === 0) {
      return new Response("No Smart Business items", { status: 200 });
    }

    const result = await ctx.runMutation(internal.smartHub.processPaidOrder, {
      deliveryId,
      topic,
      shopDomain,
      shopifyOrderGid: orderGid,
      shopifyCustomerGid: customerGid,
      lineItems,
    });

    return jsonResponse({ ok: true, result });
  }),
});


async function verifiedShopifyLifecycleRequest(
  req: Request,
  expectedTopic: string,
): Promise<{ deliveryId: string; shopDomain: string; payload: Record<string, unknown> }> {
  const signature = req.headers.get("x-shopify-hmac-sha256");
  const deliveryId = req.headers.get("x-shopify-webhook-id");
  const topic = req.headers.get("x-shopify-topic") ?? "";
  const shopDomain = req.headers.get("x-shopify-shop-domain") ?? "";

  if (!signature || !deliveryId || !shopDomain) throw new Error("Missing Shopify webhook headers");
  if (topic !== expectedTopic) throw new Error("Unexpected Shopify webhook topic");
  if (!isExpectedShopDomain(shopDomain)) throw new Error("Unexpected Shopify shop");

  const rawBody = await req.text();
  if (!(await verifyShopifyWebhook(rawBody, signature))) throw new Error("Invalid Shopify webhook signature");

  let payload: Record<string, unknown> = {};
  if (rawBody.trim()) {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  }

  return { deliveryId, shopDomain, payload };
}

function lifecycleCustomerGid(payload: Record<string, unknown>): string | undefined {
  const customer = payload.customer;
  if (!customer || typeof customer !== "object") return undefined;
  const record = customer as Record<string, unknown>;
  return shopifyGid("Customer", record.admin_graphql_api_id ?? record.id);
}

http.route({
  path: "/webhooks/shopify/customers-data-request",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const verified = await verifiedShopifyLifecycleRequest(req, "customers/data_request");
      const result = await ctx.runMutation(internal.smartHub.processLifecycleWebhook, {
        deliveryId: verified.deliveryId,
        topic: "customers/data_request",
        shopDomain: verified.shopDomain,
        shopifyCustomerGid: lifecycleCustomerGid(verified.payload),
      });
      return jsonResponse({ ok: true, result });
    } catch (error) {
      return new Response(error instanceof Error ? error.message : "Invalid webhook", { status: 401 });
    }
  }),
});

http.route({
  path: "/webhooks/shopify/customers-redact",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const verified = await verifiedShopifyLifecycleRequest(req, "customers/redact");
      const result = await ctx.runMutation(internal.smartHub.processLifecycleWebhook, {
        deliveryId: verified.deliveryId,
        topic: "customers/redact",
        shopDomain: verified.shopDomain,
        shopifyCustomerGid: lifecycleCustomerGid(verified.payload),
      });
      return jsonResponse({ ok: true, result });
    } catch (error) {
      return new Response(error instanceof Error ? error.message : "Invalid webhook", { status: 401 });
    }
  }),
});

http.route({
  path: "/webhooks/shopify/shop-redact",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const verified = await verifiedShopifyLifecycleRequest(req, "shop/redact");
      const result = await ctx.runMutation(internal.smartHub.processLifecycleWebhook, {
        deliveryId: verified.deliveryId,
        topic: "shop/redact",
        shopDomain: verified.shopDomain,
      });
      return jsonResponse({ ok: true, result });
    } catch (error) {
      return new Response(error instanceof Error ? error.message : "Invalid webhook", { status: 401 });
    }
  }),
});

http.route({
  path: "/webhooks/shopify/app-uninstalled",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const verified = await verifiedShopifyLifecycleRequest(req, "app/uninstalled");
      const result = await ctx.runMutation(internal.smartHub.processLifecycleWebhook, {
        deliveryId: verified.deliveryId,
        topic: "app/uninstalled",
        shopDomain: verified.shopDomain,
      });
      return jsonResponse({ ok: true, result });
    } catch (error) {
      return new Response(error instanceof Error ? error.message : "Invalid webhook", { status: 401 });
    }
  }),
});

export default http;