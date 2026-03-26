import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

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

export default http;
