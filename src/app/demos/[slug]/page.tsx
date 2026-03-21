import { DemoDetail } from "../../../components/Demos/DemoDetail";
import { notFound } from "next/navigation";

const DEMOS_DATA: Record<string, any> = {
  "saas-engine": {
    title: "SaaS",
    tagline: "The foundation for high-scale software platforms.",
    niche: "Enterprise",
    techStack: ["Next.js", "Convex", "Stripe", "Clerk", "Tailwind"],
    features: [
      "Multi-tenant Architecture",
      "Dynamic Subscription Middleware",
      "Real-time Analytics Dashboard",
      "Advanced RBAC System"
    ],
    description: "A complete blueprint for modern SaaS applications. Includes out-of-the-box support for workspace management, nested routing, and high-performance data patterns.",
    previewImage: "/demos/saas-preview.jpg"
  },
  "ai-assistant": {
    title: "AI Chat",
    tagline: "Cognitive interfaces that understand your users.",
    niche: "Intelligence",
    techStack: ["OpenAI", "LangChain", "Vector DB", "React", "Node"],
    features: [
      "Context-Aware RAG Pattern",
      "Streaming Response Architecture",
      "Function Calling Orchestration",
      "Multi-modal input support"
    ],
    description: "The AI Chat OS is designed for deep integration. It handles complex conversational states, vector embeddings, and real-time inference without breaking a sweat.",
    previewImage: "/demos/ai-preview.jpg"
  },
  "e-com-ultra": {
    title: "Ultra",
    tagline: "The fastest shopping experience on the planet.",
    niche: "Commerce",
    techStack: ["Shopify Storefront API", "Turbopack", "Framer", "CSS Modules"],
    features: [
      "Incremental Static Regeneration",
      "Predictive Cart Logic",
      "Localized Currency Engine",
      "Immersive Product Interaction"
    ],
    description: "Built for speed and aesthetic dominance. Ultra E-com provides a sub-100ms interaction time and a premium checkout flow that maximizes conversion rates.",
    previewImage: "/demos/ecom-preview.jpg"
  }
};

export default function DemoPage({ params }: { params: { slug: string } }) {
  const demo = DEMOS_DATA[params.slug];
  
  if (!demo) {
    notFound();
  }

  return (
    <main>
      <DemoDetail {...demo} />
    </main>
  );
}

export function generateStaticParams() {
  return [
    { slug: "saas-engine" },
    { slug: "ai-assistant" },
    { slug: "e-com-ultra" }
  ];
}
