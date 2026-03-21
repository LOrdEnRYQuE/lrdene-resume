import { DemoDetail } from "../../../components/Demos/DemoDetail";
import { Footer } from "../../../components/Footer/Footer";
import { notFound } from "next/navigation";

const DEMOS_DATA: Record<string, any> = {
  "saas-engine": {
    title: "Engine",
    tagline: "The backbone of modern digital scale.",
    niche: "Infrastructure",
    techStack: ["Node.js", "Postgres", "Redis", "Docker", "AWS"],
    features: [
      "Multi-tenant Architecture",
      "Dynamic Resource Allocation",
      "Real-time Analytics Pipeline",
      "Zero-downtime Deployment System"
    ],
    description: "Saas Engine is a battle-tested foundation for subscription-based products. It handles authentication, billing, and resource isolation with elastic scalability.",
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = DEMOS_DATA[slug];
  if (!demo) return {};

  return {
    title: `${demo.title} | Demo`,
    description: demo.tagline,
  };
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = DEMOS_DATA[slug];
  
  if (!demo) {
    notFound();
  }

  return (
    <main>
      <DemoDetail {...demo} />
      <Footer />
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
