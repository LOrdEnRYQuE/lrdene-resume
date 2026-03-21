import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedProjects = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("projects").collect();
    if (existing.length > 0) return;

    const projects = [
      {
        title: "EcoStream Dashboard",
        slug: "ecostream-dashboard",
        summary: "A real-time analytics platform for sustainable energy providers.",
        description: "EcoStream is a comprehensive monitoring solution designed for the next generation of energy companies. It provides live telemetry visualization, anomaly detection, and automated reporting.",
        challenge: "The client struggled with disparate data sources and high latency in operational response times. They needed a unified view of their entire grid.",
        solution: "We built a mission-critical dashboard using Next.js and D3.js, integrated with a high-throughput backend to process over 10,000 events per second.",
        role: "Lead Full Stack Developer",
        stack: ["Next.js", "TypeScript", "D3.js", "Convex"],
        category: "Dashboard",
        featured: true,
        status: "Completed",
        coverImage: "/assets/ecostream.jpg",
      },
      {
        title: "LuxeStay Booking",
        slug: "luxestay-booking",
        summary: "Premium hospitality booking engine with integrated AI concierge.",
        description: "LuxeStay reimagines the travel booking experience by combining a sleek, cinematic UI with a powerful AI agent that helps users plan their perfect stay.",
        challenge: "Existing booking platforms felt transactional and lacked a personalized, luxury feel. Conversion rates were low due to friction in the planning phase.",
        solution: "An AI-first booking platform that uses natural language processing to understand guest preferences and suggest tailored itineraries.",
        role: "AI Engineer & UI Designer",
        stack: ["React", "Convex", "OpenAI", "Framer Motion"],
        category: "AI",
        featured: true,
        status: "Live",
        coverImage: "/assets/luxestay.jpg",
      },
      {
        title: "CyberShield Identity",
        slug: "cybershield-identity",
        summary: "Unified visual identity and digital presence for a cybersecurity startup.",
        description: "CyberShield required a brand that felt both impenetrable and highly sophisticated. We developed a complete design system that spans from logo to product interface.",
        challenge: "The brand needed to stand out in a crowded security market while maintaining a sense of absolute trust and technical authority.",
        solution: "A visual language based on 'Digital Fortress' metaphors, utilizing high-contrast obsidian themes and gold precision accents.",
        role: "Graphic Designer",
        stack: ["Branding", "UI/UX", "Aesthetic Systems"],
        category: "Design",
        featured: true,
        status: "Shipped",
        coverImage: "/assets/cybershield.jpg",
      },
    ];

    for (const project of projects) {
      await ctx.db.insert("projects", project);
    }

    // Post Seed
    const blogPosts = [
      {
        title: "Web Developer vs Graphic Designer: What Your Business Actually Needs",
        slug: "web-dev-vs-graphic-design",
        category: "Strategy",
        excerpt: "Explaining why a hybrid approach between technical precision and visual excellence is the secret to premium branding.",
        content: "## The Intersection of Code and Design\nIn today's digital landscape, the line between a 'pretty website' and a 'functional product' has blurred. Businesses often struggle to decide whether to hire a designer or a developer first. The truth is, you need both working in harmony...\n\n### Why Hybrid Matters\nA premium brand isn't just a logo; it's an experience. When design systems inform component architecture, you get a site that looks expensive and runs at 100 on PageSpeed Insights...",
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072",
        author: "Attila Lazar",
        published: true,
        readTime: "5 min",
        date: Date.now(),
      },
      {
        title: "How I Build Premium Business Websites that Convert",
        slug: "how-i-build-premium-sites",
        category: "Development",
        excerpt: "My step-by-step process for building high-end digital products using Next.js and Convex.",
        content: "## The Discovery Phase\nEvery great product starts with a conversation. I don't just build what you ask for; I build what your business needs to grow. This involves analyzing competitors, mapping user flows, and defining a design language that screams authority...",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026",
        author: "Attila Lazar",
        published: true,
        readTime: "8 min",
        date: Date.now() - 86400000,
      }
    ];

    for (const post of blogPosts) {
      await ctx.db.insert("posts", post);
    }
  },
});
