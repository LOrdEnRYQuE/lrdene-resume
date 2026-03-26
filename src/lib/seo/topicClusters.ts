export type TopicFaq = {
  question: string;
  answer: string;
};

export type TopicTemplate = {
  slug: string;
  title: string;
  summary: string;
  intentKeywords: string[];
  businessOutcome: string;
  implementationPath: string[];
  ctaLabel: string;
  faqs: TopicFaq[];
};

export type TopicCluster = {
  slug: string;
  title: string;
  description: string;
  topics: TopicTemplate[];
};

export const TOPIC_CLUSTER_CONTENT_KEY = "seo_topic_clusters";

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    slug: "web-development",
    title: "Web Development",
    description: "Conversion-focused web engineering playbooks for service and product businesses.",
    topics: [
      {
        slug: "web-development-for-startups",
        title: "Web Development for Startups",
        summary: "How startup teams launch conversion-ready websites with measurable lead flow.",
        intentKeywords: ["startup web development", "mvp website", "conversion website"],
        businessOutcome: "Reduce time-to-launch while improving qualified inbound leads.",
        implementationPath: [
          "Define conversion goals and ICP landing journeys.",
          "Build high-speed pages with clear CTA hierarchy.",
          "Ship analytics and funnel tracking from day one.",
        ],
        ctaLabel: "Plan Startup Website",
        faqs: [
          {
            question: "How fast can a startup website go live?",
            answer: "Most startup projects can ship initial conversion pages within 2-4 weeks.",
          },
          {
            question: "What should be tracked from launch day?",
            answer: "Track CTA clicks, form starts/submits, source attribution, and landing-page conversion rates.",
          },
        ],
      },
      {
        slug: "technical-seo-for-service-websites",
        title: "Technical SEO for Service Websites",
        summary: "Architecture, metadata, and schema patterns that improve indexation and intent matching.",
        intentKeywords: ["technical seo services", "schema for service pages", "service website seo"],
        businessOutcome: "Increase organic visibility for high-intent service queries.",
        implementationPath: [
          "Map service intents to dedicated landing templates.",
          "Enforce metadata quality and internal linking depth.",
          "Publish structured data and keep sitemap fresh.",
        ],
        ctaLabel: "Audit Technical SEO",
        faqs: [
          {
            question: "Which schema matters most for service pages?",
            answer: "Service, BreadcrumbList, FAQPage, and LocalBusiness schema provide strong context to search engines.",
          },
          {
            question: "How often should sitemap data be refreshed?",
            answer: "Automatically update sitemap entries whenever service, blog, or project content changes.",
          },
        ],
      },
      {
        slug: "ecommerce-architecture-blueprint",
        title: "E-Commerce Architecture Blueprint",
        summary: "A practical stack and growth model for scalable product catalogs and checkout flows.",
        intentKeywords: ["ecommerce architecture", "headless ecommerce", "checkout optimization"],
        businessOutcome: "Improve checkout completion and platform reliability during growth.",
        implementationPath: [
          "Split storefront performance from admin operations.",
          "Instrument checkout funnel with error visibility.",
          "Optimize product indexation and collection pages.",
        ],
        ctaLabel: "Design E-Commerce Stack",
        faqs: [
          {
            question: "What is the first KPI to improve in e-commerce SEO?",
            answer: "Focus first on conversion rate by landing page and product-list click-through rate.",
          },
          {
            question: "Do I need headless architecture from day one?",
            answer: "Not always. Start with the simplest stack that supports fast iteration and clean tracking.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    description: "Operational AI and workflow automation templates for service and SaaS teams.",
    topics: [
      {
        slug: "ai-workflows-for-lead-qualification",
        title: "AI Workflows for Lead Qualification",
        summary: "How to classify, prioritize, and route inbound leads using structured automation.",
        intentKeywords: ["ai lead qualification", "lead scoring automation", "crm automation"],
        businessOutcome: "Increase qualified pipeline while reducing manual triage work.",
        implementationPath: [
          "Define lead qualification fields and scoring logic.",
          "Attach AI scoring and priority signals to submissions.",
          "Route leads into follow-up workflows with SLA alerts.",
        ],
        ctaLabel: "Implement Lead AI",
        faqs: [
          {
            question: "What data is needed for reliable lead scoring?",
            answer: "Collect source, intent, budget, timeline, and project scope details in standardized fields.",
          },
          {
            question: "Can AI replace manual sales qualification?",
            answer: "AI should augment triage and prioritization, while final qualification remains human-led.",
          },
        ],
      },
      {
        slug: "analytics-for-ai-products",
        title: "Analytics for AI Products",
        summary: "Tracking model for AI-powered products: events, attribution, and conversion quality.",
        intentKeywords: ["ai product analytics", "event taxonomy", "attribution model"],
        businessOutcome: "Turn usage data into roadmap and revenue decisions.",
        implementationPath: [
          "Define event taxonomy and naming governance.",
          "Track funnel drop-off by step and segment.",
          "Build acquisition and sales-intent dashboards.",
        ],
        ctaLabel: "Set Analytics Model",
        faqs: [
          {
            question: "What events are mandatory in AI product funnels?",
            answer: "Track starts, key actions, completion, and quality dimensions tied to business outcomes.",
          },
          {
            question: "How do we connect attribution to conversions?",
            answer: "Persist first-touch and last-touch context and attach it to every conversion event.",
          },
        ],
      },
      {
        slug: "ai-seo-automation",
        title: "AI SEO Automation",
        summary: "Template system for scaling SEO pages while maintaining quality and intent relevance.",
        intentKeywords: ["programmatic seo ai", "seo automation", "topic cluster pages"],
        businessOutcome: "Scale indexed content without sacrificing quality signals.",
        implementationPath: [
          "Define cluster/topic templates with strict quality rules.",
          "Generate pages from controlled datasets.",
          "Integrate generated paths into sitemap and internal links.",
        ],
        ctaLabel: "Scale SEO Templates",
        faqs: [
          {
            question: "How to avoid thin content in programmatic SEO?",
            answer: "Use strict templates with real business context, unique value props, and concrete implementation detail.",
          },
          {
            question: "Should every template page be indexed?",
            answer: "Index only pages with unique intent and useful, non-duplicative information.",
          },
        ],
      },
    ],
  },
];

function isFaq(value: unknown): value is TopicFaq {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.question === "string" && typeof entry.answer === "string";
}

function isTopicTemplate(value: unknown): value is TopicTemplate {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.slug === "string" &&
    typeof entry.title === "string" &&
    typeof entry.summary === "string" &&
    Array.isArray(entry.intentKeywords) &&
    entry.intentKeywords.every((keyword) => typeof keyword === "string") &&
    typeof entry.businessOutcome === "string" &&
    Array.isArray(entry.implementationPath) &&
    entry.implementationPath.every((step) => typeof step === "string") &&
    typeof entry.ctaLabel === "string" &&
    Array.isArray(entry.faqs) &&
    entry.faqs.every((faq) => isFaq(faq))
  );
}

function isTopicCluster(value: unknown): value is TopicCluster {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.slug === "string" &&
    typeof entry.title === "string" &&
    typeof entry.description === "string" &&
    Array.isArray(entry.topics) &&
    entry.topics.every((topic) => isTopicTemplate(topic))
  );
}

export function parseTopicClusters(value: unknown): TopicCluster[] | null {
  if (!Array.isArray(value)) return null;
  if (!value.every((entry) => isTopicCluster(entry))) return null;
  return value;
}

export function resolveTopicClusters(value: unknown): TopicCluster[] {
  return parseTopicClusters(value) ?? TOPIC_CLUSTERS;
}

export function getAllTopicClusterPaths(clusters: TopicCluster[] = TOPIC_CLUSTERS) {
  return clusters.flatMap((cluster) =>
    cluster.topics.map((topic) => ({
      cluster: cluster.slug,
      topic: topic.slug,
      path: `/insights/${cluster.slug}/${topic.slug}`,
    })),
  );
}

export function getTopicClusterBySlug(clusterSlug: string, clusters: TopicCluster[] = TOPIC_CLUSTERS) {
  return clusters.find((cluster) => cluster.slug === clusterSlug) ?? null;
}

export function getTopicBySlugs(
  clusterSlug: string,
  topicSlug: string,
  clusters: TopicCluster[] = TOPIC_CLUSTERS,
) {
  const cluster = getTopicClusterBySlug(clusterSlug, clusters);
  if (!cluster) return null;
  const topic = cluster.topics.find((entry) => entry.slug === topicSlug) ?? null;
  if (!topic) return null;
  return { cluster, topic };
}
