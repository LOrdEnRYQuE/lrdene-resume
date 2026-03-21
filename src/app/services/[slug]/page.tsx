import { ServiceDetail } from "../../../components/Services/ServiceDetail";
import { Footer } from "../../../components/Footer/Footer";
import { Globe, Cpu, Layout, MessageSquare, Zap } from "lucide-react";
import { notFound } from "next/navigation";

export const runtime = "edge";

const SERVICES_DATA: Record<string, any> = {
  "web-development": {
    title: "Premium Web",
    description: "High-performance, cinematic web experiences engineered for scale. We don't just build websites; we craft digital ecosystems that outperform the competition.",
    icon: <Globe size={40} />,
    features: [
      "Next.js 16 App Router Architecture",
      "Edge-Optimized Performance (SSR/ISR)",
      "Premium Glassmorphism Design Language",
      "Dynamic Framer Motion Orchestration",
      "Headless CMS Integration (Convex/Sanity)",
      "SEO Engine Localization"
    ],
    process: [
      { step: "Discovery", desc: "Analyzing your business DNA and technical requirements." },
      { step: "Architecting", desc: "Defining the tech stack and system architecture." },
      { step: "Execution", desc: "Agile development with continuous integration." },
      { step: "Launch", desc: "Precision deployment and performance tuning." }
    ]
  },
  "ai-integration": {
    title: "Intelligence",
    description: "Empower your platform with custom AI agents and LLM workflows. We bridge the gap between static code and cognitive automation.",
    icon: <Cpu size={40} />,
    features: [
      "Custom LLM Agent Development",
      "Retrieval-Augmented Generation (RAG)",
      "AI Workflow Automation",
      "Natural Language Interfaces",
      "Real-time Data Processing",
      "Cognitive Content Generation"
    ],
    process: [
      { step: "Intelligence Audit", desc: "Identifying high-impact AI opportunities." },
      { step: "Modeling", desc: "Prompt engineering and RAG pipeline design." },
      { step: "Integration", desc: "Seamless embedding of AI into your existing stack." },
      { step: "Optimization", desc: "Fine-tuning response accuracy and costs." }
    ]
  },
  "ui-ux-design": {
    title: "Strategic",
    description: "Design that commands attention. We blend aesthetic precision with psychological triggers to create interfaces that convert.",
    icon: <Layout size={40} />,
    features: [
      "Cinematic Motion Design",
      "Micro-interaction Engineering",
      "Conversion-Optimized UX Architecture",
      "Brand Identity Evolution",
      "Interactive Prototyping",
      "Design System Development"
    ],
    process: [
      { step: "Mood Mapping", desc: "Defining the visual and emotional tone." },
      { step: "Wireframing", desc: "Mapping user journeys and conversion paths." },
      { step: "High-Fidelity", desc: "Crafting the final premium visual layer." },
      { step: "Prototyping", desc: "Validating interactions with motion." }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];
  if (!service) return {};

  return {
    title: `${service.title} | Service`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];
  
  if (!service) {
    notFound();
  }

  return (
    <main>
      <ServiceDetail {...service} />
      <Footer />
    </main>
  );
}

