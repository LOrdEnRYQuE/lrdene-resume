import { mutation } from "./_generated/server";

export const seedDemos = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("demos").collect();
    if (existing.length > 0) return;

    const demoItems = [
      {
        name: "Epicurean Elite MVP",
        slug: "restaurant-mvp",
        branch: "demo/restaurant-booking",
        url: "https://demo-restaurant.lrdene.com",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070",
        iconName: "Utensils",
        description: "A premium restaurant booking and menu management system with real-time reservation tracking and customer analytics.",
        techStack: ["Next.js", "Convex", "Tailwind CSS", "Framer Motion"],
        features: ["Real-time Bookings", "Dynamic Menu Editor", "Customer CRM", "Analytics Dashboard"],
        status: "active",
        category: "Hospitality",
        featured: true,
      },
      {
        name: "Luxe Estate Showcase",
        slug: "real-estate-mvp",
        branch: "demo/real-estate",
        url: "https://demo-estate.lrdene.com",
        imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070",
        iconName: "Home",
        description: "High-end real estate listing platform with interactive maps, 3D tour integration, and lead capture for agents.",
        techStack: ["Next.js", "Mapbox", "Convex", "Three.js"],
        features: ["Map Integration", "3D Virtual Tours", "Agent Portal", "Automated Scheduling"],
        status: "active",
        category: "Real Estate",
        featured: false,
      },
      {
        name: "Neural Nexus AI",
        slug: "ai-tool-mvp",
        branch: "demo/ai-workflows",
        url: "https://demo-ai.lrdene.com",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
        iconName: "Brain",
        description: "An AI-powered document analysis and workflow automation tool for legal and financial professional services.",
        techStack: ["Next.js", "OpenAI API", "LangChain", "Convex"],
        features: ["PDF Intelligence", "Automated Drafting", "Entity Extraction", "Semantic Search"],
        status: "active",
        category: "AI Tool",
        featured: true,
      }
    ];

    for (const demo of demoItems) {
      await ctx.db.insert("demos", {
        ...demo,
        createdAt: Date.now(),
      });
    }
  },
});
