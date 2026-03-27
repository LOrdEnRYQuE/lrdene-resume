import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("demos")
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("demos").order("desc").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("demos")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    name: v.string(),
    slug: v.string(),
    branch: v.string(),
    url: v.string(),
    imageUrl: v.optional(v.string()),
    iconName: v.optional(v.string()),
    description: v.string(),
    techStack: v.array(v.string()),
    features: v.array(v.string()),
    status: v.string(),
    category: v.string(),
    featured: v.boolean(),
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    return await ctx.db.insert("demos", {
      name: args.name,
      slug: args.slug,
      branch: args.branch,
      url: args.url,
      imageUrl: args.imageUrl,
      iconName: args.iconName,
      description: args.description,
      techStack: args.techStack,
      features: args.features,
      status: args.status,
      category: args.category,
      featured: args.featured,
      blocks: args.blocks,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    adminToken: ADMIN_TOKEN,
    id: v.id("demos"),
    name: v.string(),
    slug: v.string(),
    branch: v.string(),
    url: v.string(),
    imageUrl: v.optional(v.string()),
    iconName: v.optional(v.string()),
    description: v.string(),
    techStack: v.array(v.string()),
    features: v.array(v.string()),
    status: v.string(),
    category: v.string(),
    featured: v.boolean(),
    blocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.patch(args.id, {
      name: args.name,
      slug: args.slug,
      branch: args.branch,
      url: args.url,
      imageUrl: args.imageUrl,
      iconName: args.iconName,
      description: args.description,
      techStack: args.techStack,
      features: args.features,
      status: args.status,
      category: args.category,
      featured: args.featured,
      blocks: args.blocks,
    });
  },
});

export const remove = mutation({
  args: { adminToken: ADMIN_TOKEN, id: v.id("demos") },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    await ctx.db.delete(args.id);
  },
});

export const seedAllDemos = mutation({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const globalStack = ["Next.js", "TypeScript", "Convex", "Responsive UI"];
    const categoryStackBoost: Record<string, string[]> = {
      Hospitality: ["Booking UX", "CMS"],
      "Beauty & Wellness": ["Calendar Flow", "CRM Integrations"],
      "Real Estate": ["Map Integrations", "Search Indexing"],
      "Legal & Consulting": ["Secure Portals", "Document Workflows"],
      "Home Services": ["Field Ops", "Payments"],
      "E-commerce": ["Checkout Flows", "Catalog SEO", "Stripe"],
      "AI & Analytics": ["Realtime Dashboards", "LLM Workflows"],
      EduTech: ["Auth", "Progress Tracking"],
      HealthTech: ["HIPAA-aware UX", "Role-based Access"],
      Logistics: ["Route Logic", "Tracking"],
      Business: ["Conversion CRO", "Landing Optimization"],
      "AI & Neural Agencies": ["Agent Orchestration", "Knowledge Retrieval"],
      "Architecture & Design": ["3D Preview", "Design Systems"],
      Automotive: ["Lead Qualification", "Inventory Flows"],
      "Automotive Service": ["Booking Automation", "Pricing Logic"],
      "Finance & Brokerage": ["Compliance UX", "Lead Routing"],
      "Construction & Engineering": ["Project Pipeline", "Service Area Mapping"],
      Commerce: ["Sustainability Data", "Marketplace Ops"],
      "AI & Tech": ["DevTools", "API Integrations"],
      "Marketing Tech": ["GEO/SEO Analytics", "Content Intelligence"],
    };
    const demoItems = [
      {
        name: "LaMaison Fine Dining",
        slug: "restaurant",
        imageUrl: "/assets/restaurant-hero.jpg",
        featured: true,
        category: "Hospitality",
        description: "Modern booking + menu + admin flow. A complete hospitality ecosystem.",
        techStack: ["React", "CSS Modules", "Framer Motion"],
        url: "/demos/restaurant",
        branch: "main",
        status: "active",
        features: ["Booking System", "Menu Editor", "Admin Dashboard"]
      },
      {
        name: "TheGuild Grooming",
        slug: "salon",
        imageUrl: "/assets/salon-hero.jpg",
        featured: true,
        category: "Beauty & Wellness",
        description: "Appointment scheduling and service showcase for premium salons.",
        techStack: ["React", "CSS Modules", "Lucide"],
        url: "/demos/salon",
        branch: "main",
        status: "active",
        features: ["Scheduling", "Service List", "Staff Profiles"]
      },
      {
        name: "Luxe Estate",
        slug: "real-estate",
        imageUrl: "/assets/realestate-hero.jpg",
        featured: true,
        category: "Real Estate",
        description: "Premium property listings and agent dashboards with advanced filters.",
        techStack: ["React", "Next.js", "CSS Modules"],
        url: "/demos/real-estate",
        branch: "main",
        status: "active",
        features: ["Property Gallery", "Advanced Search", "Agent Tools"]
      },
      {
        name: "LegalTrust Case Portal",
        slug: "lawyer",
        imageUrl: "/assets/lawyer-hero.jpg",
        featured: true,
        category: "Legal & Consulting",
        description: "Secure case management and client portals for law firms.",
        techStack: ["React", "Convex", "Framer Motion"],
        url: "/demos/lawyer",
        branch: "main",
        status: "active",
        features: ["Client Portal", "Case Tracking", "Document Storage"]
      },
      {
        name: "ServicePro Tracker",
        slug: "home-services",
        imageUrl: "/assets/homeservices-hero.jpg",
        featured: true,
        category: "Home Services",
        description: "Job tracking and invoice management for modern contractors.",
        techStack: ["React", "CSS Modules", "Lucide React"],
        url: "/demos/home-services",
        branch: "main",
        status: "active",
        features: ["Job Scheduling", "Invoicing", "Field Crew Mobile"]
      },
      {
        name: "Vogue Retail",
        slug: "ecommerce",
        imageUrl: "/assets/ecommerce-hero.jpg",
        featured: true,
        category: "E-commerce",
        description: "High-conversion product stores with integrated inventory tools.",
        techStack: ["React", "Framer Motion", "Stripe"],
        url: "/demos/ecommerce",
        branch: "main",
        status: "active",
        features: ["Cart & Checkout", "Product Catalog", "Order Management"]
      },
      {
        name: "NeuralNexus Admin",
        slug: "ai-dashboard",
        imageUrl: "/assets/ai-dashboard-hero.png",
        featured: true,
        category: "AI & Analytics",
        description: "High-intelligence SaaS dashboard for monitoring AI workloads.",
        techStack: ["React", "Lucide", "CSS Modules"],
        url: "/demos/ai-dashboard",
        branch: "main",
        status: "active",
        features: ["Real-time Analytics", "Task Queues", "Model Performance"]
      },
      {
        name: "LearnFlow Portal",
        slug: "course-platform",
        imageUrl: "/assets/course-hero.png",
        featured: true,
        category: "EduTech",
        description: "Modern learning management with AI study partner integration.",
        techStack: ["React", "Framer Motion", "Lucide"],
        url: "/demos/course-platform",
        branch: "main",
        status: "active",
        features: ["Course Player", "Student Dashboard", "AI Tutor"]
      },
      {
        name: "HealCore Patient",
        slug: "healthcare",
        imageUrl: "/assets/healthcare-hero.png",
        featured: true,
        category: "HealthTech",
        description: "Secure patient-centric portal with telemedicine and record tracking.",
        techStack: ["React", "CSS Modules", "Lucide"],
        url: "/demos/healthcare",
        branch: "main",
        status: "active",
        features: ["Telemedicine", "Patient Records", "Prescription Tracking"]
      },
      {
        name: "RouteMaster Fleet",
        slug: "logistics",
        imageUrl: "/assets/logistics-hero.png",
        featured: true,
        category: "Logistics",
        description: "Power-user utility for fleet management and shipment tracking.",
        techStack: ["React", "Framer Motion", "Lucide"],
        url: "/demos/logistics",
        branch: "main",
        status: "active",
        features: ["Fleet Map", "Shipment Tracking", "Driver Logs"]
      },
      {
        name: "SaaSPro Launch",
        slug: "saas-landing",
        imageUrl: "/assets/saas-hero.png",
        featured: true,
        category: "Business",
        description: "Conversion-optimized landing page for new product launches.",
        techStack: ["React", "Framer Motion", "CSS Modules"],
        url: "/demos/saas-landing",
        branch: "main",
        status: "active",
        features: ["Pricing Blocks", "Testimonials", "Smooth Transitions"]
      },
      {
        name: "AI Agents & AI Bots",
        slug: "ai-agents",
        imageUrl: "/assets/ai-agents-hero.png",
        featured: true,
        category: "AI & Neural Agencies",
        description: "Autonomous intelligence for customer support, data analysis, and workflow automation.",
        techStack: ["React", "Convex", "AI"],
        url: "/demos/ai-agents",
        branch: "main",
        status: "active",
        features: ["Bot Builder", "Knowledge Base", "Chat Widget"]
      },
      {
        name: "ArchNeural Studio",
        slug: "architecture",
        imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2426",
        featured: true,
        category: "Architecture & Design",
        description: "Generative design systems for spatial optimization and cinematic visualization.",
        techStack: ["Next.js", "AI", "ArchViz"],
        url: "/demos/architecture",
        branch: "main",
        status: "active",
        features: ["Generative Floorplans", "3D Preview", "Style Transfer"]
      },
      {
        name: "Premium Auto Gallery",
        slug: "car-dealer",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2426",
        featured: true,
        category: "Automotive",
        description: "High-end vehicle showcase with integrated test drive booking.",
        techStack: ["React", "Next.js", "Framer Motion"],
        url: "/demos/car-dealer",
        branch: "main",
        status: "active",
        features: ["Inventory Search", "Booking", "Finance Calculator"]
      },
      {
        name: "Elite Shine Detailing",
        slug: "car-detailing",
        imageUrl: "/assets/cardetailing-hero.png",
        featured: true,
        category: "Automotive Service",
        description: "Precision car care packages and appointment scheduling.",
        techStack: ["React", "CSS Modules", "Lucide"],
        url: "/demos/car-detailing",
        branch: "main",
        status: "active",
        features: ["Pricing", "Scheduler", "Packages"]
      },
      {
        name: "Horizon Finance Broker",
        slug: "broker",
        imageUrl: "/assets/broker-hero.png",
        featured: true,
        category: "Finance & Brokerage",
        description: "Professional consultation portal for institutional and private clients.",
        techStack: ["React", "Lucide", "CSS Modules"],
        url: "/demos/broker",
        branch: "main",
        status: "active",
        features: ["Lead Form", "Market Updates", "Consultation Scheduler"]
      },
      {
        name: "Titan Structures",
        slug: "construction",
        imageUrl: "/assets/construction-hero.png",
        featured: true,
        category: "Construction & Engineering",
        description: "Industrial-grade project management and high-impact structural visualization.",
        techStack: ["React", "Next.js", "Industrial Glass"],
        url: "/demos/construction",
        branch: "main",
        status: "active",
        features: ["Project Gallery", "Blueprint Viewer", "Service Area Map"]
      },
      {
        name: "EcoMarket",
        slug: "green-eco",
        description: "Sustainable goods marketplace with real-time carbon footprint tracking and ethical sourcing verification.",
        imageUrl: "/assets/green-eco-hero.png",
        featured: true,
        techStack: ["E-Commerce", "Sustainability", "SaaS"],
        url: "/demos/green-eco",
        category: "Commerce",
        branch: "main",
        status: "active",
        features: ["Carbon Tracking", "Ethical Verification", "Eco-Score"]
      },
      {
        name: "AgentHire",
        slug: "ai-marketplace",
        description: "Decentralized marketplace for production-ready AI agents. Deploy specialized cognitive units into your stack.",
        imageUrl: "/assets/agent-marketplace-hero.png",
        featured: true,
        techStack: ["AI", "Marketplace", "DevTools"],
        url: "/demos/ai-marketplace",
        category: "AI & Tech",
        branch: "main",
        status: "active",
        features: ["Agent Catalog", "Instant Deployment", "Performance Ratings"]
      },
      {
        name: "MindCare",
        slug: "mental-health",
        description: "AI-powered mental health companion with sentiment-aware journaling and personalized wellness paths.",
        imageUrl: "/assets/mental-health-hero.png",
        featured: true,
        techStack: ["Health", "AI", "Wellness"],
        url: "/demos/mental-health",
        category: "HealthTech",
        branch: "main",
        status: "active",
        features: ["Sentiment Journaling", "Wellness Companion", "AI Coaching"]
      },
      {
        name: "AutoTrader AI",
        slug: "car-selling",
        description: "Dedicated car selling platform featuring AI-driven valuation, instant offers, and secure appraisals.",
        imageUrl: "/assets/car-selling-hero.png",
        featured: true,
        techStack: ["Automotive", "FinTech", "AI"],
        url: "/demos/car-selling",
        category: "Automotive",
        branch: "main",
        status: "active",
        features: ["AI Valuation", "Instant Offers", "Appraisal Flow"]
      },
      {
        name: "OmniRank AI",
        slug: "ai-seo",
        description: "Generative Engine Optimization (GEO) platform for tracking brand citations and visibility across AI models.",
        imageUrl: "/assets/ai-seo-hero.png",
        featured: true,
        techStack: ["SEO", "GEO", "AI"],
        url: "/demos/ai-seo",
        category: "Marketing Tech",
        branch: "main",
        status: "active",
        features: ["Citation Engine", "Visibility Monitor", "Model Analysis"]
      }
    ];

    for (const demo of demoItems) {
      const enrichedStack = Array.from(
        new Set([
          ...demo.techStack,
          ...globalStack,
          ...(categoryStackBoost[demo.category] ?? []),
        ]),
      );
      const normalizedBranch = demo.branch === "main" ? `demo/${demo.slug}` : demo.branch;
      const upsertPayload = {
        ...demo,
        techStack: enrichedStack,
        branch: normalizedBranch,
      };
      const existing = await ctx.db
        .query("demos")
        .withIndex("by_slug", (q) => q.eq("slug", demo.slug))
        .unique();
      
      if (!existing) {
        await ctx.db.insert("demos", {
          ...upsertPayload,
          createdAt: Date.now(),
        });
      } else {
        await ctx.db.patch(existing._id, upsertPayload);
      }
    }
  },
});
