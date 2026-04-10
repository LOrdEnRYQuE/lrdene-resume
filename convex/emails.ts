import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    text: v.string(),
    html: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; id?: string; error?: string }> => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return { success: false, error: "RESEND_API_KEY not found" };
    }

    // Resolve sender address from settings
    const settings: Doc<"settings"> | null = await ctx.runQuery(internal.settings.getInternal, {});
    const senderName: string = settings?.emailConfig?.senderName || "Portfolio OS";
    let senderEmail: string = settings?.emailConfig?.senderEmail || "notifications@lordenryque.com";
    
    // Safety guard for transition
    if (senderEmail.includes("lrdene.dev")) {
      senderEmail = "notifications@lordenryque.com";
    }
    
    const from: string = `${senderName} <${senderEmail}>`;

    const response: Response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [args.to],
        subject: args.subject,
        text: args.text,
        html: args.html || args.text,
      }),
    });

    if (!response.ok) {
      const errorStr: string = await response.text();
      console.error("Resend error:", errorStr);
      return { success: false, error: errorStr };
    }

    const data = (await response.json()) as { id: string };
    return { success: true, id: data.id };
  },
});

export const sendTestEmail = action({
  args: {
    to: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; id?: string; error?: string }> => {
    return await ctx.runAction((internal as any).emails.sendEmail, {
      to: args.to,
      subject: "Connection Test: Portfolio OS x Resend",
      text: "Your Resend and Cloudflare connection is active and synchronized. Webhooks are ready to ingest events.",
      html: "<strong>Your Resend and Cloudflare connection is active and synchronized.</strong><br/><br/>Webhooks are ready to ingest events.",
    });
  },
});

export const sendAutoReply = action({
  args: { leadId: v.id("leads") },
  handler: async () => {
    // This would be triggered by a mutation check
    // Logic for auto-reply content
  },
});
