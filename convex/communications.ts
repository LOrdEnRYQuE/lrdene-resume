import { action, internalMutation, internalQuery, mutation, query, type ActionCtx, type MutationCtx } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

const MAX_THREADS = 200;
const MAX_THREAD_MESSAGES = 300;
const MAX_TEMPLATES = 200;
const MAX_CAMPAIGNS = 100;
const MAX_CAMPAIGN_RECIPIENTS = 250;
const MAX_TEMPLATE_REVISIONS = 50;
const MAX_TEMPLATE_PERFORMANCE_MESSAGES = 2000;

const DEFAULT_TEMPLATES = [
  {
    key: "sales_followup_24h",
    name: "24h Follow-up",
    category: "follow_up",
    subject: "Quick follow-up on your {{projectType}} inquiry",
    body:
      "Hi {{firstName}},\n\nThanks again for reaching out. I reviewed your request and can share a clear scope, timeline, and next steps.\n\nWould you like a 20-minute call this week?\n\nBest,\nAttila",
  },
  {
    key: "sales_proposal_nudge",
    name: "Proposal Nudge",
    category: "proposal",
    subject: "Checking in on your project proposal",
    body:
      "Hi {{firstName}},\n\nChecking in on the proposal I sent. Happy to adjust scope, milestones, or budget ranges so it fits your priorities.\n\nBest,\nAttila",
  },
  {
    key: "marketing_promo_new_service",
    name: "Promo: New Service",
    category: "marketing",
    subject: "New offer for {{projectType}} growth",
    body:
      "Hi {{firstName}},\n\nI just launched a new offer focused on faster launch cycles and stronger conversion outcomes.\n\nIf you want details, reply and I will send a concise breakdown.\n\nBest,\nAttila",
  },
];

function getResendApiKey() {
  return process.env.RESEND_API_KEY ?? "";
}


async function resolveFromAddress(ctx: ActionCtx): Promise<string> {
  const envFrom = process.env.EMAIL_FROM;
  if (envFrom) {
    return envFrom;
  }

  const settings: Doc<"settings"> | null = await ctx.runQuery(internal.settings.getInternal, {});
  const senderName = settings?.emailConfig?.senderName?.trim();
  const senderEmail = settings?.emailConfig?.senderEmail?.trim();
  if (senderEmail) {
    return `${senderName || "Portfolio OS"} <${senderEmail}>`;
  }
  return "Portfolio OS <notifications@lrdene.dev>";
}

function renderTemplate(
  text: string,
  vars: { firstName: string; projectType: string; company: string },
) {
  return text
    .replaceAll("{{firstName}}", vars.firstName)
    .replaceAll("{{projectType}}", vars.projectType)
    .replaceAll("{{company}}", vars.company);
}

async function saveTemplateRevision(
  ctx: MutationCtx,
  template: Doc<"emailTemplates">,
) {
  await ctx.db.insert("emailTemplateRevisions", {
    templateId: template._id,
    key: template.key,
    name: template.name,
    category: template.category,
    subject: template.subject,
    body: template.body,
    active: template.active,
    createdAt: Date.now(),
  });
}

async function ensureThreadByLeadOrEmail(
  ctx: MutationCtx,
  args: {
    leadId?: Id<"leads">;
    participantEmail: string;
    participantName?: string;
    subject: string;
    source: string;
  },
) {
  if (args.leadId) {
    const byLead = await ctx.db
      .query("emailThreads")
      .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
      .take(1);
    if (byLead[0]) {
      return byLead[0];
    }
  }

  const byEmail = await ctx.db
    .query("emailThreads")
    .withIndex("by_participantEmail", (q) => q.eq("participantEmail", args.participantEmail))
    .take(1);
  if (byEmail[0]) {
    return byEmail[0];
  }

  const now = Date.now();
  const threadId = await ctx.db.insert("emailThreads", {
    leadId: args.leadId,
    participantEmail: args.participantEmail,
    participantName: args.participantName,
    subject: args.subject,
    status: "open",
    source: args.source,
    tags: [],
    lastMessageAt: now,
    unreadCount: 0,
    createdAt: now,
  });
  return await ctx.db.get(threadId);
}

export const seedDefaultTemplates = mutation({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const now = Date.now();
    for (const template of DEFAULT_TEMPLATES) {
      const existing = await ctx.db
        .query("emailTemplates")
        .withIndex("by_key", (q) => q.eq("key", template.key))
        .take(1);
      if (existing[0]) {
        continue;
      }
      await ctx.db.insert("emailTemplates", {
        ...template,
        active: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const ingestLeadSubmission = internalMutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      return null;
    }

    const now = Date.now();
    const subject = `New inquiry: ${lead.projectType}`;
    const thread =
      (await ctx.db
        .query("emailThreads")
        .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
        .take(1))[0] ??
      (await ctx.db.get(
        await ctx.db.insert("emailThreads", {
          leadId: args.leadId,
          participantEmail: lead.email,
          participantName: lead.name,
          subject,
          status: "open",
          source: "lead_form",
          tags: [],
          lastMessageAt: now,
          unreadCount: 0,
          createdAt: now,
        }),
      ));

    if (!thread) {
      return null;
    }

    await ctx.db.insert("emailMessages", {
      threadId: thread._id,
      leadId: args.leadId,
      direction: "incoming",
      channel: "email",
      subject,
      body: lead.message,
      status: "received",
      createdAt: now,
    });

    await ctx.db.patch(thread._id, {
      lastMessageAt: now,
      unreadCount: (thread.unreadCount ?? 0) + 1,
      participantName: lead.name,
      participantEmail: lead.email,
      subject,
      status: "open",
    });

    return thread._id;
  },
});

export const syncLeadThreads = mutation({
  args: { adminToken: ADMIN_TOKEN, limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
    const leads = await ctx.db.query("leads").order("desc").take(limit);
    let created = 0;

    for (const lead of leads) {
      const existing = await ctx.db
        .query("emailThreads")
        .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
        .take(1);
      if (existing[0]) {
        continue;
      }

      const now = Date.now();
      const subject = `Lead thread: ${lead.projectType}`;
      const threadId = await ctx.db.insert("emailThreads", {
        leadId: lead._id,
        participantEmail: lead.email,
        participantName: lead.name,
        subject,
        status: "open",
        source: "lead_form",
        tags: [],
        lastMessageAt: now,
        unreadCount: 0,
        createdAt: now,
      });

      await ctx.db.insert("emailMessages", {
        threadId,
        leadId: lead._id,
        direction: "incoming",
        channel: "email",
        subject,
        body: lead.message,
        status: "received",
        createdAt: now,
      });
      created += 1;
    }

    return { scanned: leads.length, created };
  },
});

export const listThreads = query({
  args: {
    adminToken: ADMIN_TOKEN,
    search: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const raw = await ctx.db
      .query("emailThreads")
      .withIndex("by_lastMessageAt")
      .order("desc")
      .take(MAX_THREADS);

    const queryText = (args.search ?? "").trim().toLowerCase();
    const filtered = raw.filter((thread) => {
      if (args.status && args.status !== "all" && thread.status !== args.status) {
        return false;
      }
      if (!queryText) {
        return true;
      }
      const haystack = `${thread.participantName ?? ""} ${thread.participantEmail} ${thread.subject}`.toLowerCase();
      return haystack.includes(queryText);
    });

    const withPreview = await Promise.all(
      filtered.map(async (thread) => {
        const latestMessage = (
          await ctx.db
            .query("emailMessages")
            .withIndex("by_thread_and_createdAt", (q) => q.eq("threadId", thread._id))
            .order("desc")
            .take(1)
        )[0];
        return {
          ...thread,
          preview: latestMessage?.body?.slice(0, 120) ?? "",
          latestDirection: latestMessage?.direction ?? "incoming",
        };
      }),
    );

    return withPreview;
  },
});

export const getThreadMessages = query({
  args: { adminToken: ADMIN_TOKEN, threadId: v.id("emailThreads") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      return { thread: null, messages: [] };
    }

    const messages = await ctx.db
      .query("emailMessages")
      .withIndex("by_thread_and_createdAt", (q) => q.eq("threadId", args.threadId))
      .take(MAX_THREAD_MESSAGES);

    return { thread, messages };
  },
});

export const getThreadEvents = query({
  args: { adminToken: ADMIN_TOKEN, threadId: v.id("emailThreads") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db
      .query("emailEvents")
      .withIndex("by_thread_and_createdAt", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .take(120);
  },
});

export const markThreadRead = mutation({
  args: { adminToken: ADMIN_TOKEN, threadId: v.id("emailThreads") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.threadId, { unreadCount: 0 });
  },
});

function normalizeProviderStatus(eventType: string) {
  const type = eventType.toLowerCase();
  if (type.includes("bounce") || type.includes("failed")) {
    return "failed";
  }
  if (type.includes("open")) {
    return "opened";
  }
  if (type.includes("click")) {
    return "clicked";
  }
  if (type.includes("deliver") || type.includes("sent")) {
    return "sent";
  }
  return "sent";
}

export const ingestProviderWebhookEvent = mutation({
  args: {
    provider: v.string(),
    eventType: v.string(),
    messageId: v.optional(v.string()),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    subject: v.optional(v.string()),
    text: v.optional(v.string()),
    timestamp: v.optional(v.number()),
    payload: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const eventType = args.eventType.toLowerCase();
    const now = args.timestamp ?? Date.now();

    if (
      eventType.includes("inbound") ||
      eventType.includes("reply") ||
      eventType.includes("received")
    ) {
      const recipientEmail = (args.from ?? args.to ?? "").trim().toLowerCase();
      if (!recipientEmail) {
        return { ok: false, reason: "missing_inbound_email" as const };
      }

      const existingThread = (
        await ctx.db
          .query("emailThreads")
          .withIndex("by_participantEmail", (q) => q.eq("participantEmail", recipientEmail))
          .take(1)
      )[0];

      const subject = args.subject?.trim() || "Inbound reply";
      const messageBody = args.text?.trim() || args.payload?.slice(0, 4000) || "";

      const threadId =
        existingThread?._id ??
        (await ctx.db.insert("emailThreads", {
          participantEmail: recipientEmail,
          participantName: recipientEmail,
          subject,
          status: "open",
          source: "manual",
          tags: [],
          lastMessageAt: now,
          unreadCount: 0,
          createdAt: now,
        }));
      const thread = existingThread ?? (await ctx.db.get(threadId));
      if (!thread) {
        return { ok: false, reason: "thread_init_failed" as const };
      }

      const duplicate = args.messageId
        ? (
            await ctx.db
              .query("emailMessages")
              .withIndex("by_providerMessageId", (q) => q.eq("providerMessageId", args.messageId))
              .take(1)
          )[0]
        : null;
      if (duplicate) {
        return { ok: true, deduped: true as const };
      }

      await ctx.db.insert("emailMessages", {
        threadId: thread._id,
        leadId: thread.leadId,
        direction: "incoming",
        channel: "email",
        subject,
        body: messageBody,
        status: "received",
        providerMessageId: args.messageId,
        createdAt: now,
      });

      await ctx.db.insert("emailEvents", {
        threadId: thread._id,
        provider: args.provider,
        eventType: eventType,
        status: "received",
        from: args.from,
        to: args.to,
        subject,
        payloadSnippet: args.payload?.slice(0, 500),
        createdAt: now,
      });

      await ctx.db.patch(thread._id, {
        participantEmail: recipientEmail,
        subject,
        status: "open",
        lastMessageAt: now,
        unreadCount: (thread.unreadCount ?? 0) + 1,
      });

      return { ok: true, kind: "inbound" as const, threadId: thread._id };
    }

    if (!args.messageId) {
      return { ok: false, reason: "missing_message_id" as const };
    }

    const message = (
      await ctx.db
        .query("emailMessages")
        .withIndex("by_providerMessageId", (q) => q.eq("providerMessageId", args.messageId))
        .take(1)
    )[0];

    if (!message) {
      return { ok: false, reason: "message_not_found" as const };
    }

    const nextStatus = normalizeProviderStatus(eventType);
    await ctx.db.patch(message._id, {
      status: nextStatus,
      error: nextStatus === "failed" ? args.payload?.slice(0, 500) : undefined,
    });

    await ctx.db.insert("emailEvents", {
      threadId: message.threadId,
      messageId: message._id,
      provider: args.provider,
      eventType: eventType,
      status: nextStatus,
      from: args.from,
      to: args.to,
      subject: args.subject ?? message.subject,
      payloadSnippet: args.payload?.slice(0, 500),
      createdAt: now,
    });

    const thread = await ctx.db.get(message.threadId);
    if (thread) {
      await ctx.db.patch(thread._id, {
        status: nextStatus === "failed" ? "open" : "waiting",
      });
    }

    return { ok: true, kind: "status" as const, status: nextStatus };
  },
});

export const listTemplates = query({
  args: {
    adminToken: ADMIN_TOKEN,
    category: v.optional(v.string()),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const rows = args.category
      ? await ctx.db
          .query("emailTemplates")
          .withIndex("by_category", (q) => q.eq("category", args.category as string))
          .take(MAX_TEMPLATES)
      : await ctx.db.query("emailTemplates").order("desc").take(MAX_TEMPLATES);

    if (args.activeOnly) {
      return rows.filter((x) => x.active);
    }
    return rows;
  },
});

export const listTemplateRevisions = query({
  args: { adminToken: ADMIN_TOKEN, templateId: v.id("emailTemplates") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db
      .query("emailTemplateRevisions")
      .withIndex("by_templateId_and_createdAt", (q) => q.eq("templateId", args.templateId))
      .order("desc")
      .take(MAX_TEMPLATE_REVISIONS);
  },
});

export const restoreTemplateRevision = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    templateId: v.id("emailTemplates"),
    revisionId: v.id("emailTemplateRevisions"),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const template = await ctx.db.get(args.templateId);
    const revision = await ctx.db.get(args.revisionId);
    if (!template || !revision || revision.templateId !== args.templateId) {
      return { success: false };
    }

    await saveTemplateRevision(ctx, template);
    await ctx.db.patch(args.templateId, {
      key: revision.key,
      name: revision.name,
      category: revision.category,
      subject: revision.subject,
      body: revision.body,
      active: revision.active,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const upsertTemplate = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.optional(v.id("emailTemplates")),
    key: v.string(),
    name: v.string(),
    category: v.string(),
    subject: v.string(),
    body: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const now = Date.now();
    if (args.id) {
      const current = await ctx.db.get(args.id);
      if (current) {
        await saveTemplateRevision(ctx, current);
      }
      await ctx.db.patch(args.id, {
        key: args.key,
        name: args.name,
        category: args.category,
        subject: args.subject,
        body: args.body,
        active: args.active,
        updatedAt: now,
      });
      return args.id;
    }

    const existing = await ctx.db
      .query("emailTemplates")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .take(1);
    if (existing[0]) {
      await saveTemplateRevision(ctx, existing[0]);
      await ctx.db.patch(existing[0]._id, {
        name: args.name,
        category: args.category,
        subject: args.subject,
        body: args.body,
        active: args.active,
        updatedAt: now,
      });
      return existing[0]._id;
    }

    return await ctx.db.insert("emailTemplates", {
      key: args.key,
      name: args.name,
      category: args.category,
      subject: args.subject,
      body: args.body,
      active: args.active,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteTemplate = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("emailTemplates") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const revisions = await ctx.db
      .query("emailTemplateRevisions")
      .withIndex("by_templateId_and_createdAt", (q) => q.eq("templateId", args.id))
      .take(MAX_TEMPLATE_REVISIONS);
    for (const revision of revisions) {
      await ctx.db.delete(revision._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const createCampaign = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    stageFilter: v.optional(v.string()),
    stageFilters: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const now = Date.now();
    return await ctx.db.insert("emailCampaigns", {
      name: args.name,
      subject: args.subject,
      body: args.body,
      status: args.status ?? "draft",
      stageFilter: args.stageFilter,
      stageFilters: args.stageFilters,
      scheduledAt: args.scheduledAt,
      recipients: 0,
      sent: 0,
      failed: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listCampaigns = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db
      .query("emailCampaigns")
      .withIndex("by_createdAt")
      .order("desc")
      .take(MAX_CAMPAIGNS);
  },
});

export const listCampaignsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("emailCampaigns")
      .withIndex("by_createdAt")
      .order("desc")
      .take(MAX_CAMPAIGNS);
  },
});

export const updateCampaignWorkflow = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    campaignId: v.id("emailCampaigns"),
    status: v.string(),
    scheduledAt: v.optional(v.number()),
    stageFilters: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.campaignId, {
      status: args.status,
      scheduledAt: args.scheduledAt,
      stageFilters: args.stageFilters,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const getCampaignById = query({
  args: { adminToken: ADMIN_TOKEN, id: v.id("emailCampaigns") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.get(args.id);
  },
});

export const getCampaignByIdInternal = internalQuery({
  args: { id: v.id("emailCampaigns") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const recordOutgoingMessage = internalMutation({
  args: {
    threadId: v.optional(v.id("emailThreads")),
    leadId: v.optional(v.id("leads")),
    to: v.string(),
    participantName: v.optional(v.string()),
    subject: v.string(),
    body: v.string(),
    templateKey: v.optional(v.string()),
    templateBlockSignature: v.optional(v.string()),
    campaignId: v.optional(v.id("emailCampaigns")),
    status: v.string(),
    providerMessageId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thread = await ensureThreadByLeadOrEmail(ctx, {
      leadId: args.leadId,
      participantEmail: args.to,
      participantName: args.participantName,
      subject: args.subject,
      source: args.campaignId ? "campaign" : "manual",
    });
    if (!thread) {
      return null;
    }

    const messageId = await ctx.db.insert("emailMessages", {
      threadId: thread._id,
      leadId: args.leadId,
      direction: "outgoing",
      channel: "email",
      subject: args.subject,
      body: args.body,
      templateKey: args.templateKey,
      templateBlockSignature: args.templateBlockSignature,
      campaignId: args.campaignId,
      status: args.status,
      providerMessageId: args.providerMessageId,
      error: args.error,
      createdAt: now,
      sentAt: args.status === "sent" ? now : undefined,
    });

    await ctx.db.patch(thread._id, {
      participantName: args.participantName ?? thread.participantName,
      participantEmail: args.to,
      subject: args.subject,
      lastMessageAt: now,
      status: "waiting",
    });

    return messageId;
  },
});

export const setCampaignStatus = internalMutation({
  args: {
    campaignId: v.id("emailCampaigns"),
    status: v.string(),
    recipients: v.optional(v.number()),
    sent: v.optional(v.number()),
    failed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaignId, {
      status: args.status,
      recipients: args.recipients,
      sent: args.sent,
      failed: args.failed,
      updatedAt: Date.now(),
    });
  },
});

export const upsertCampaignRecipient = internalMutation({
  args: {
    campaignId: v.id("emailCampaigns"),
    leadId: v.id("leads"),
    email: v.string(),
    status: v.string(),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("emailCampaignRecipients")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
      .take(MAX_CAMPAIGN_RECIPIENTS);
    const row = existing.find((x) => x.leadId === args.leadId);

    if (row) {
      await ctx.db.patch(row._id, {
        email: args.email,
        status: args.status,
        error: args.error,
        sentAt: args.status === "sent" ? Date.now() : undefined,
      });
      return row._id;
    }

    return await ctx.db.insert("emailCampaignRecipients", {
      campaignId: args.campaignId,
      leadId: args.leadId,
      email: args.email,
      status: args.status,
      error: args.error,
      sentAt: args.status === "sent" ? Date.now() : undefined,
    });
  },
});

export const sendThreadEmail = action({
  args: {
    adminToken: v.string(),
    threadId: v.optional(v.id("emailThreads")),
    leadId: v.optional(v.id("leads")),
    to: v.string(),
    participantName: v.optional(v.string()),
    subject: v.string(),
    body: v.string(),
    html: v.optional(v.string()),
    templateKey: v.optional(v.string()),
    templateBlockSignature: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    await requireAdminToken(args.adminToken);
    const emailArgs = {
      threadId: args.threadId,
      leadId: args.leadId,
      to: args.to,
      participantName: args.participantName,
      subject: args.subject,
      body: args.body,
      html: args.html,
      templateKey: args.templateKey,
      templateBlockSignature: args.templateBlockSignature,
    };
    const resendApiKey = getResendApiKey();
    const fromAddress: string = await resolveFromAddress(ctx);
    if (!resendApiKey) {
      await ctx.runMutation(internal.communications.recordOutgoingMessage, {
        ...emailArgs,
        status: "failed",
        error: "RESEND_API_KEY not found",
      });
      return { success: false, error: "RESEND_API_KEY not found" };
    }

    const response: Response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [args.to],
        subject: args.subject,
        text: args.body,
        html: args.html || args.body.replaceAll("\n", "<br/>"),
      }),
    });

    if (!response.ok) {
      const error: string = await response.text();
      await ctx.runMutation(internal.communications.recordOutgoingMessage, {
        ...emailArgs,
        status: "failed",
        error,
      });
      return { success: false, error };
    }

    const payload = (await response.json()) as { id?: string };
    await ctx.runMutation(internal.communications.recordOutgoingMessage, {
      ...emailArgs,
      status: "sent",
      providerMessageId: payload.id,
    });

    return { success: true };
  },
});

async function executeCampaignSend(
  ctx: ActionCtx,
  campaign: Doc<"emailCampaigns">,
): Promise<{ success: boolean; error?: string; recipients?: number; sent?: number; failed?: number }> {
  if (campaign.status === "scheduled" && campaign.scheduledAt && campaign.scheduledAt > Date.now()) {
    return { success: false, error: "Campaign is scheduled for later" };
  }
  if (!["draft", "review", "scheduled", "failed"].includes(campaign.status)) {
    return { success: false, error: `Campaign status "${campaign.status}" cannot be sent now` };
  }

  const leads: Doc<"leads">[] = await ctx.runQuery(internal.leads.listInternal, {});
  const stageFilters = campaign.stageFilters && campaign.stageFilters.length > 0
    ? campaign.stageFilters
    : campaign.stageFilter
      ? [campaign.stageFilter]
      : [];
  const recipients: Doc<"leads">[] = leads
    .filter((lead) => {
      if (stageFilters.length === 0 || stageFilters.includes("all")) {
        return true;
      }
      return stageFilters.includes(lead.status);
    })
    .slice(0, MAX_CAMPAIGN_RECIPIENTS);

  await ctx.runMutation(internal.communications.setCampaignStatus, {
    campaignId: campaign._id,
    status: "sending",
    recipients: recipients.length,
    sent: 0,
    failed: 0,
  });

  const resendApiKey = getResendApiKey();
  const fromAddress = await resolveFromAddress(ctx);
  if (!resendApiKey) {
    await ctx.runMutation(internal.communications.setCampaignStatus, {
      campaignId: campaign._id,
      status: "failed",
      recipients: recipients.length,
      sent: 0,
      failed: recipients.length,
    });
    return { success: false, error: "RESEND_API_KEY not found" };
  }

  let sent = 0;
  let failed = 0;
  for (const lead of recipients) {
    const vars = {
      firstName: lead.name.split(" ")[0] ?? lead.name,
      projectType: lead.projectType,
      company: lead.company ?? "your team",
    };
    const subject = renderTemplate(campaign.subject, vars);
    const body = renderTemplate(campaign.body, vars);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [lead.email],
        subject,
        text: body,
        html: body.replaceAll("\n", "<br/>"),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      failed += 1;
      await ctx.runMutation(internal.communications.recordOutgoingMessage, {
        leadId: lead._id,
        to: lead.email,
        participantName: lead.name,
        subject,
        body,
        campaignId: campaign._id,
        status: "failed",
        error,
      });
      await ctx.runMutation(internal.communications.upsertCampaignRecipient, {
        campaignId: campaign._id,
        leadId: lead._id,
        email: lead.email,
        status: "failed",
        error,
      });
    } else {
      sent += 1;
      await ctx.runMutation(internal.communications.recordOutgoingMessage, {
        leadId: lead._id,
        to: lead.email,
        participantName: lead.name,
        subject,
        body,
        campaignId: campaign._id,
        status: "sent",
      });
      await ctx.runMutation(internal.communications.upsertCampaignRecipient, {
        campaignId: campaign._id,
        leadId: lead._id,
        email: lead.email,
        status: "sent",
      });
    }
  }

  await ctx.runMutation(internal.communications.setCampaignStatus, {
    campaignId: campaign._id,
    status: failed > 0 ? "failed" : "sent",
    recipients: recipients.length,
    sent,
    failed,
  });

  return { success: true, recipients: recipients.length, sent, failed };
}

export const sendCampaignNow = action({
  args: {
    adminToken: v.string(),
    campaignId: v.id("emailCampaigns"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; error?: string; recipients?: number; sent?: number; failed?: number }> => {
    await requireAdminToken(args.adminToken);
    const campaign: Doc<"emailCampaigns"> | null = await ctx.runQuery(internal.communications.getCampaignByIdInternal, {
      id: args.campaignId,
    });
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }
    return await executeCampaignSend(ctx, campaign);
  },
});

export const dispatchDueCampaigns = action({
  args: {
    adminToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const campaigns = await ctx.runQuery(internal.communications.listCampaignsInternal, {});
    const now = Date.now();
    let dispatched = 0;
    for (const campaign of campaigns) {
      if (campaign.status !== "scheduled") {
        continue;
      }
      if (!campaign.scheduledAt || campaign.scheduledAt > now) {
        continue;
      }
      const result = await executeCampaignSend(ctx, campaign);
      if (result.success) {
        dispatched += 1;
      }
    }
    return { dispatched };
  },
});

export const getTemplatePerformance = query({
  args: { adminToken: ADMIN_TOKEN, templateKey: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const messages = await ctx.db.query("emailMessages").order("desc").take(MAX_TEMPLATE_PERFORMANCE_MESSAGES);
    const events = await ctx.db.query("emailEvents").order("desc").take(MAX_TEMPLATE_PERFORMANCE_MESSAGES);

    const outgoingTemplateMessages = messages.filter(
      (message) => message.direction === "outgoing" && message.templateKey,
    );
    const messageById = new Map(outgoingTemplateMessages.map((message) => [message._id, message]));

    const stats = new Map<
      string,
      {
        templateKey: string;
        blockSignature: string;
        sent: number;
        failed: number;
        opened: number;
        clicked: number;
        replied: number;
      }
    >();

    const ensureStat = (templateKey: string, blockSignature: string) => {
      const key = `${templateKey}::${blockSignature}`;
      const existing = stats.get(key);
      if (existing) {
        return existing;
      }
      const created = {
        templateKey,
        blockSignature,
        sent: 0,
        failed: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
      };
      stats.set(key, created);
      return created;
    };

    for (const message of outgoingTemplateMessages) {
      const templateKey = message.templateKey as string;
      if (args.templateKey && templateKey !== args.templateKey) {
        continue;
      }
      const blockSignature = message.templateBlockSignature ?? "unknown";
      const row = ensureStat(templateKey, blockSignature);
      if (message.status === "sent") {
        row.sent += 1;
      }
      if (message.status === "failed") {
        row.failed += 1;
      }
    }

    for (const event of events) {
      if (!event.messageId) {
        continue;
      }
      const message = messageById.get(event.messageId);
      if (!message || !message.templateKey) {
        continue;
      }
      if (args.templateKey && message.templateKey !== args.templateKey) {
        continue;
      }
      const row = ensureStat(message.templateKey, message.templateBlockSignature ?? "unknown");
      const type = event.eventType.toLowerCase();
      if (type.includes("open")) {
        row.opened += 1;
      }
      if (type.includes("click")) {
        row.clicked += 1;
      }
      if (type.includes("inbound") || type.includes("reply")) {
        row.replied += 1;
      }
    }

    const timeline = [...messages].reverse();
    const threadLastTemplate = new Map<
      Id<"emailThreads">,
      { templateKey: string; blockSignature: string }
    >();
    for (const message of timeline) {
      if (message.direction === "outgoing" && message.templateKey) {
        if (args.templateKey && message.templateKey !== args.templateKey) {
          continue;
        }
        threadLastTemplate.set(message.threadId, {
          templateKey: message.templateKey,
          blockSignature: message.templateBlockSignature ?? "unknown",
        });
        continue;
      }
      if (message.direction === "incoming") {
        const lastTemplate = threadLastTemplate.get(message.threadId);
        if (!lastTemplate) {
          continue;
        }
        const row = ensureStat(lastTemplate.templateKey, lastTemplate.blockSignature);
        row.replied += 1;
      }
    }

    return [...stats.values()].sort((a, b) => b.sent - a.sent);
  },
});

export const listAssetGovernance = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const rows = await ctx.db.query("assetGovernance").withIndex("by_updatedAt").order("desc").take(500);
    const templates = await ctx.db.query("emailTemplates").order("desc").take(MAX_TEMPLATES);
    const usageByPath: Record<string, number> = {};
    for (const template of templates) {
      const body = template.body;
      for (const row of rows) {
        if (!row.assetPath) {
          continue;
        }
        if (body.includes(row.assetPath)) {
          usageByPath[row.assetPath] = (usageByPath[row.assetPath] ?? 0) + 1;
        }
      }
    }
    return rows.map((row) => ({
      ...row,
      usedByTemplates: usageByPath[row.assetPath] ?? 0,
    }));
  },
});

export const upsertAssetGovernance = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    assetPath: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const existing = await ctx.db
      .query("assetGovernance")
      .withIndex("by_assetPath", (q) => q.eq("assetPath", args.assetPath))
      .take(1);
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, {
        tags: args.tags,
        updatedAt: Date.now(),
      });
      return existing[0]._id;
    }
    return await ctx.db.insert("assetGovernance", {
      assetPath: args.assetPath,
      tags: args.tags,
      updatedAt: Date.now(),
    });
  },
});
