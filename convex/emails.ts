import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    text: v.string(),
    html: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return { success: false, error: "RESEND_API_KEY not found" };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Portoflio OS <notifications@lrdene.dev>", // This should be a verified domain
        to: [args.to],
        subject: args.subject,
        text: args.text,
        html: args.html || args.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true };
  },
});

export const sendAutoReply = action({
  args: { leadId: v.id("leads") },
  handler: async () => {
    // This would be triggered by a mutation check
    // Logic for auto-reply content
  },
});
