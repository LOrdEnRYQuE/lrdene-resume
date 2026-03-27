export type FallbackService = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  iconName: string;
  status: "active";
  category: string;
  features: string[];
  process: Array<{ step: string; desc: string }>;
};

export const FALLBACK_SERVICES: FallbackService[] = [
  {
    _id: "fallback-web-development",
    title: "Web Development",
    slug: "web-development",
    description:
      "High-performance, cinematic web experiences engineered for scale. We don't just build websites; we craft digital ecosystems that outperform the competition.",
    iconName: "Globe",
    status: "active",
    category: "Engineering",
    features: [
      "Next.js 16 App Router Architecture",
      "Edge-Optimized Performance (SSR/ISR)",
      "Premium Glassmorphism Design Language",
      "Dynamic Framer Motion Orchestration",
      "Headless CMS Integration (Convex/Sanity)",
      "SEO Engine Localization",
    ],
    process: [
      { step: "Discovery", desc: "Analyzing your business DNA and technical requirements." },
      { step: "Architecting", desc: "Defining the tech stack and system architecture." },
      { step: "Execution", desc: "Agile development with continuous integration." },
      { step: "Launch", desc: "Precision deployment and performance tuning." },
    ],
  },
  {
    _id: "fallback-ai-integration",
    title: "AI Integration",
    slug: "ai-integration",
    description:
      "Empower your platform with custom AI agents and LLM workflows. We bridge the gap between static code and cognitive automation.",
    iconName: "Cpu",
    status: "active",
    category: "Artificial Intelligence",
    features: [
      "Custom LLM Agent Development",
      "Retrieval-Augmented Generation (RAG)",
      "AI Workflow Automation",
      "Natural Language Interfaces",
      "Real-time Data Processing",
      "Cognitive Content Generation",
    ],
    process: [
      { step: "Intelligence Audit", desc: "Identifying high-impact AI opportunities." },
      { step: "Modeling", desc: "Prompt engineering and RAG pipeline design." },
      { step: "Integration", desc: "Seamless embedding of AI into your existing stack." },
      { step: "Optimization", desc: "Fine-tuning response accuracy and costs." },
    ],
  },
  {
    _id: "fallback-ui-ux-design",
    title: "UI/UX Architecture",
    slug: "ui-ux-design",
    description:
      "Design that commands attention. We blend aesthetic precision with psychological triggers to create interfaces that convert.",
    iconName: "Layout",
    status: "active",
    category: "Design",
    features: [
      "Cinematic Motion Design",
      "Micro-interaction Engineering",
      "Conversion-Optimized UX Architecture",
      "Brand Identity Evolution",
      "Interactive Prototyping",
      "Design System Development",
    ],
    process: [
      { step: "Mood Mapping", desc: "Defining the visual and emotional tone." },
      { step: "Wireframing", desc: "Mapping user journeys and conversion paths." },
      { step: "High-Fidelity", desc: "Crafting the final premium visual layer." },
      { step: "Prototyping", desc: "Validating interactions with motion." },
    ],
  },
];

export function findFallbackServiceBySlug(slug: string) {
  return FALLBACK_SERVICES.find((service) => service.slug === slug) ?? null;
}
