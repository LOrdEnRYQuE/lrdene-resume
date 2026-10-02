import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { createSmartPublicCode, isExpectedShopDomain, verifyShopifySessionToken, verifyShopifyWebhook } from "./shopifyAuth";

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
      return jsonResponse({ ok: true, hub });
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

    if (!orderGid || !customerGid) {
      return new Response("Order has no Shopify customer identity", { status: 200 });
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

export default http;
