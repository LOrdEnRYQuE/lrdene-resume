import { mutation } from "./_generated/server";

export const seedOfferings = mutation({
  handler: async (ctx) => {
    // Seed Services
    const existingServices = await ctx.db.query("services").collect();
    if (existingServices.length === 0) {
      const services = [
        {
          title: "SaaS MVP Accelerator",
          slug: "saas-mvp",
          description: "Go from idea to production-ready SaaS in just 14 days. Includes Auth, DB, Stripe, and a premium UI.",
          iconName: "Zap",
          price: "From $4,500",
          deliveryTime: "2 Weeks",
          features: ["Next.js & Convex Architecture", "Stripe Subscription Logic", "Premium Component Library", "Post-launch Support"],
          process: [
            { step: "Architecture Sync", desc: "1-on-1 strategy call to map your business logic." },
            { step: "Rapid Build", desc: "Agile development with daily branch updates." },
            { step: "Launch & Handover", desc: "Production deployment and full IP transfer." }
          ],
          status: "active",
          category: "Development"
        },
        {
          title: "AI Integration Audit",
          slug: "ai-audit",
          description: "Strategic analysis of your business workflows to identify high-ROI AI integration points.",
          iconName: "Brain",
          price: "$1,200",
          deliveryTime: "3 Days",
          features: ["LLM Compatibility Report", "Custom Prompt Engineering", "Automated Workflow Design", "Security & Privacy Audit"],
          process: [
            { step: "Workflow Discovery", desc: "Audit of your current manual processes." },
            { step: "AI Mapping", desc: "Designing custom RAG or Agentic solutions." }
          ],
          status: "active",
          category: "AI"
        }
      ];
      for (const s of services) {
        await ctx.db.insert("services", s);
      }
    }

    // Seed Products
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length === 0) {
      const products = [
        {
          name: "The Agentic Portfolio OS",
          slug: "portfolio-os",
          description: "The exact Next.js + Convex engine powering this site. Built for high-end freelancers and studios.",
          price: 149,
          currency: "USD",
          category: "Templates",
          features: ["Convex Auth & Storage", "Neural Lead Pipeline", "Interactive Demo Hub", "Glassmorphic Design System"],
          techStack: ["Next.js", "Convex", "Framer Motion"],
          active: true
        },
        {
          name: "SaaS UI Kit: Obsidian",
          slug: "obsidian-ui",
          description: "A collection of 50+ premium dark-mode components designed for brutalist efficiency and high-end aesthetics.",
          price: 79,
          currency: "USD",
          category: "UI Kits",
          features: ["Tailwind v4 Optimized", "Hand-crafted Icons", "Figma Source Files", "Responsive Analytics Blocks"],
          techStack: ["React", "Tailwind CSS"],
          active: true
        }
      ];
      for (const p of products) {
        await ctx.db.insert("products", p);
      }
    }
  },
});
