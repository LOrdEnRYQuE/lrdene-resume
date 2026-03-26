import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()), 
    projectType: v.string(),
    budget: v.string(),
    timeline: v.optional(v.string()), 
    message: v.string(),
    status: v.string(), 
    notes: v.optional(v.array(v.object({
      body: v.string(),
      timestamp: v.number(),
    }))),
    aiScore: v.optional(v.number()), // 0-100
    aiPriority: v.optional(v.string()), // "High", "Medium", "Low"
    niche: v.optional(v.string()), // e.g. "car-dealer", "salon"
    createdAt: v.optional(v.number()),
  }).index("by_status", ["status"]),
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.string(),
    author: v.string(),
    published: v.boolean(),
    readTime: v.string(),
    date: v.number(),
    tags: v.optional(v.array(v.string())),
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(), // JSON string for flexibility
    }))),
  }).index("by_slug", ["slug"]).index("by_category", ["category"]),
  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    description: v.string(),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    role: v.string(),
    stack: v.array(v.string()),
    category: v.string(), 
    featured: v.boolean(),
    status: v.string(),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    coverImage: v.string(),
    iconName: v.optional(v.string()),
    year: v.optional(v.string()),
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(),
    }))),
  }).index("by_slug", ["slug"]).index("by_category", ["category"]),
  siteMetadata: defineTable({
    route: v.string(), 
    title: v.string(),
    description: v.string(),
    keywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
  }).index("by_route", ["route"]),
  settings: defineTable({
    siteName: v.string(),
    siteDescription: v.string(),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    gaId: v.string(),
    maintenanceMode: v.optional(v.boolean()),
    socialLinks: v.object({
      github: v.string(),
      twitter: v.string(),
      linkedin: v.string(),
      instagram: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
    emailConfig: v.object({
      receiver: v.string(),
      senderName: v.optional(v.string()),
      senderEmail: v.optional(v.string()),
      webhookSecret: v.optional(v.string()),
    }),
    appearance: v.optional(v.object({
      primaryColor: v.string(),
      accentColor: v.string(),
      fontFamily: v.string(),
    })),
  }),
  adminPreferences: defineTable({
    username: v.string(),
    leadNichePreset: v.optional(v.string()),
    leadViewMode: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_username", ["username"]),
  services: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    iconName: v.string(), 
    price: v.optional(v.string()), // e.g. "From $2,500"
    deliveryTime: v.optional(v.string()), // e.g. "2 Weeks"
    features: v.array(v.string()),
    process: v.array(v.object({
      step: v.string(),
      desc: v.string(),
    })),
    status: v.string(), // "active", "draft"
    category: v.string(), // "Development", "AI", "Design"
    featured: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(), // Numerical for potential stripe integration
    currency: v.string(), // "USD", "EUR"
    imageUrl: v.optional(v.string()),
    category: v.string(), // "Templates", "UI Kits", "Prompts"
    features: v.array(v.string()),
    techStack: v.optional(v.array(v.string())),
    downloadUrl: v.optional(v.string()),
    active: v.boolean(),
    featured: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]).index("by_category", ["category"]),
  demos: defineTable({
    name: v.string(),
    slug: v.string(),
    branch: v.string(),
    url: v.string(),
    imageUrl: v.optional(v.string()), // For cover images
    iconName: v.optional(v.string()), // Lucide icon name
    description: v.string(),
    techStack: v.array(v.string()),
    features: v.array(v.string()),
    status: v.string(), // "active", "archived"
    category: v.string(), // "Hospitality", "Real Estate", etc.
    featured: v.boolean(),
    createdAt: v.optional(v.number()),
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(),
    }))),
  }).index("by_status", ["status"]).index("by_slug", ["slug"]),
  analytics: defineTable({
    route: v.string(),
    referrer: v.optional(v.string()),
    device: v.optional(v.string()),
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    timestamp: v.number(),
    sessionId: v.string(), 
  }).index("by_route", ["route"]).index("by_timestamp", ["timestamp"]),
  events: defineTable({
    type: v.string(), // "view", "click", "conversion"
    conversionType: v.optional(v.string()), // "service_inquiry", "product_click", "demo_request"
    value: v.optional(v.number()), // estimated value in USD
    label: v.string(), // Button name, File name
    route: v.string(),
    timestamp: v.number(),
    sessionId: v.string(),
  }).index("by_type", ["type"]).index("by_timestamp", ["timestamp"]),
  clientPortals: defineTable({
    leadId: v.id("leads"),
    projectId: v.optional(v.id("projects")),
    secretCode: v.string(),
    status: v.string(), // "active", "completed", "on-hold"
    lastAccessed: v.optional(v.number()),
  }).index("by_secretCode", ["secretCode"]).index("by_leadId", ["leadId"]),
  portalAccessAttempts: defineTable({
    fingerprint: v.string(),
    attempts: v.number(),
    windowStart: v.number(),
    lastAttempt: v.number(),
    blockedUntil: v.optional(v.number()),
  }).index("by_fingerprint", ["fingerprint"]),
  adminLoginAttempts: defineTable({
    fingerprint: v.string(),
    attempts: v.number(),
    windowStart: v.number(),
    lastAttempt: v.number(),
    blockedUntil: v.optional(v.number()),
  }).index("by_fingerprint", ["fingerprint"]),
  portalMessages: defineTable({
    portalId: v.id("clientPortals"),
    author: v.string(), // "admin" or "client"
    content: v.string(),
    timestamp: v.number(),
    attachments: v.optional(v.array(v.string())),
  }).index("by_portalId", ["portalId"]),
  portalAssets: defineTable({
    portalId: v.id("clientPortals"),
    storageId: v.id("_storage"),
    name: v.string(),
    format: v.string(), // "image", "pdf", etc.
    status: v.string(), // "pending", "approved", "shipped"
    feedback: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_portalId", ["portalId"]),
  media: defineTable({
    storageId: v.id("_storage"),
    name: v.string(),
    size: v.number(),
    type: v.string(),
    alt: v.optional(v.string()), // AI-generated alt text
    metadata: v.optional(v.object({
      width: v.optional(v.number()),
      height: v.optional(v.number()),
    })),
    createdAt: v.number(),
  }).index("by_type", ["type"]),
  pageContent: defineTable({
    key: v.string(), // "about", "contact"
    data: v.any(), // Flexible JSON for different page structures
    lastUpdated: v.number(),
  }).index("by_key", ["key"]),
  pageSections: defineTable({
    page: v.string(), // "home", "about", "services", "demos/*"
    sectionKey: v.string(), // "hero", "cta", "features"
    type: v.string(), // "hero", "gallery", "cards", "richText", "buttons"
    data: v.any(),
    status: v.string(), // "draft" | "published"
    order: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_page_and_status_and_order", ["page", "status", "order"])
    .index("by_page_and_order", ["page", "order"])
    .index("by_page_and_sectionKey", ["page", "sectionKey"]),
  designTokens: defineTable({
    key: v.string(), // "global"
    data: v.object({
      palette: v.object({
        primary: v.string(),
        accent: v.string(),
        background: v.string(),
        text: v.string(),
      }),
      typography: v.object({
        fontFamily: v.string(),
        baseSizePx: v.number(),
      }),
      button: v.object({
        shape: v.union(v.literal("pill"), v.literal("rounded"), v.literal("square")),
        radiusPx: v.number(),
        gradientFrom: v.string(),
        gradientTo: v.string(),
        gradientMid: v.optional(v.string()),
        textColor: v.string(),
        borderColor: v.string(),
        borderInnerColor: v.optional(v.string()),
        shadow: v.string(),
        pressedShadow: v.string(),
      }),
    }),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
  emailThreads: defineTable({
    leadId: v.optional(v.id("leads")),
    participantEmail: v.string(),
    participantName: v.optional(v.string()),
    subject: v.string(),
    status: v.string(), // "open" | "waiting" | "closed"
    source: v.string(), // "lead_form" | "manual" | "campaign"
    tags: v.optional(v.array(v.string())),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_lastMessageAt", ["lastMessageAt"])
    .index("by_participantEmail", ["participantEmail"])
    .index("by_leadId", ["leadId"]),
  emailMessages: defineTable({
    threadId: v.id("emailThreads"),
    leadId: v.optional(v.id("leads")),
    direction: v.string(), // "incoming" | "outgoing"
    channel: v.string(), // "email"
    subject: v.string(),
    body: v.string(),
    templateKey: v.optional(v.string()),
    templateBlockSignature: v.optional(v.string()),
    campaignId: v.optional(v.id("emailCampaigns")),
    status: v.string(), // "draft" | "sent" | "failed" | "received"
    providerMessageId: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    sentAt: v.optional(v.number()),
  })
    .index("by_thread_and_createdAt", ["threadId", "createdAt"])
    .index("by_leadId_and_createdAt", ["leadId", "createdAt"])
    .index("by_templateKey", ["templateKey"])
    .index("by_campaignId", ["campaignId"])
    .index("by_providerMessageId", ["providerMessageId"]),
  emailTemplates: defineTable({
    key: v.string(),
    name: v.string(),
    category: v.string(), // sales_reply | follow_up | proposal | marketing
    subject: v.string(),
    body: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"]),
  emailTemplateRevisions: defineTable({
    templateId: v.id("emailTemplates"),
    key: v.string(),
    name: v.string(),
    category: v.string(),
    subject: v.string(),
    body: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_templateId_and_createdAt", ["templateId", "createdAt"]),
  assetGovernance: defineTable({
    assetPath: v.string(),
    tags: v.array(v.string()),
    updatedAt: v.number(),
  })
    .index("by_assetPath", ["assetPath"])
    .index("by_updatedAt", ["updatedAt"]),
  emailCampaigns: defineTable({
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    status: v.string(), // "draft" | "review" | "scheduled" | "sending" | "sent" | "failed"
    stageFilter: v.optional(v.string()),
    stageFilters: v.optional(v.array(v.string())),
    scheduledAt: v.optional(v.number()),
    recipients: v.number(),
    sent: v.number(),
    failed: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
  emailCampaignRecipients: defineTable({
    campaignId: v.id("emailCampaigns"),
    leadId: v.id("leads"),
    email: v.string(),
    status: v.string(), // "queued" | "sent" | "failed"
    error: v.optional(v.string()),
    sentAt: v.optional(v.number()),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_campaignId_and_status", ["campaignId", "status"]),
  emailEvents: defineTable({
    threadId: v.optional(v.id("emailThreads")),
    messageId: v.optional(v.id("emailMessages")),
    provider: v.string(), // "resend"
    eventType: v.string(), // "delivered" | "opened" | "bounced" | "inbound" ...
    status: v.optional(v.string()),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    subject: v.optional(v.string()),
    payloadSnippet: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_thread_and_createdAt", ["threadId", "createdAt"])
    .index("by_messageId", ["messageId"])
    .index("by_createdAt", ["createdAt"]),
});
