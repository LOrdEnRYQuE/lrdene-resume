import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

export const chat = action({
  args: {
    message: v.string(),
    history: v.optional(v.array(v.object({ role: v.string(), content: v.string() }))),
    niche: v.optional(v.string()), // e.g., "car-dealer", "broker", "salon", "detailing"
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const niche = args.niche || "general";

    if (!apiKey) {
      const nicheNames: Record<string, string> = {
        "car-dealer": "Car Dealer Assistant",
        "broker": "Real Estate Assistant",
        "salon": "Salon Assistant",
        "detailing": "Detailing Assistant",
        "general": "AI Assistant"
      };
      const name = nicheNames[niche] || "AI Assistant";
      return `I'm currently in 'Offline Mode' as the ${name}. Please add an OpenAI API Key to start a real conversation. You can still leave your info for the team!`;
    }

    try {
      // In a real implementation, we would send the systemPrompt + history + message to OpenAI
      return `[${niche.toUpperCase()} MODE] I'd be happy to help with your ${niche.replace('-', ' ')} needs! Should I take down your details so the team can reach out?`;
    } catch (error) {
      console.error("Chat Error:", error);
      return "I had a small error. Please try again.";
    }
  },
});

export const createLeadFromChat = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    message: v.string(),
    niche: v.optional(v.string()),
    privacyConsent: v.optional(v.boolean()),
    privacyConsentAt: v.optional(v.number()),
    privacyConsentVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      name: args.name,
      email: args.email,
      projectType: args.projectType,
      budget: "TBD from Chat",
      message: args.message,
      niche: args.niche,
      privacyConsent: args.privacyConsent,
      privacyConsentAt: args.privacyConsentAt,
      privacyConsentVersion: args.privacyConsentVersion,
      status: "New",
      notes: [],
      createdAt: Date.now(),
    });
    return leadId;
  },
});

// Original Mocks for legacy support
const MOCK_SUGGESTIONS: Record<string, string[]> = {
  hero_title: ["Architecting Digital Excellence", "Engineering the Future of Web"],
  hero_subtitle: ["Bespoke software architecture and premium design.", "Transforming complex ideas into seamless digital experiences."],
  cta_text: ["Begin Your Evolution", "Secure Your Slot"]
};

export const suggestContent = action({
  args: {
    type: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const options = MOCK_SUGGESTIONS[args.type] || ["Premium Content Generated"];
    return options[Math.floor(Math.random() * options.length)];
  },
});
