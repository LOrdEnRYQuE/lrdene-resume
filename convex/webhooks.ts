import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendSlackNotification = action({
  args: {
    text: v.string(),
    fields: v.optional(v.array(v.object({
      title: v.string(),
      value: v.string(),
      short: v.boolean(),
    }))),
  },
  handler: async (ctx, args) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("SLACK_WEBHOOK_URL not set, skipping notification.");
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: args.text,
          attachments: args.fields ? [{
            fields: args.fields,
            color: "#D4AF37", // Gold
          }] : undefined,
        }),
      });
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
    }
  },
});

export const sendDiscordNotification = action({
  args: {
    content: v.string(),
    title: v.string(),
    description: v.string(),
    fields: v.optional(v.array(v.object({
      name: v.string(),
      value: v.string(),
      inline: v.boolean(),
    }))),
  },
  handler: async (ctx, args) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("DISCORD_WEBHOOK_URL not set, skipping notification.");
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: args.content,
          embeds: [{
            title: args.title,
            description: args.description,
            color: 0xD4AF25, // Gold hex
            fields: args.fields,
            timestamp: new Date().toISOString(),
          }],
        }),
      });
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
    }
  },
});
