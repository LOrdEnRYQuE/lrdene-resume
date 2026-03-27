export type TopicFaq = {
  question: string;
  answer: string;
};

export type TopicProofSignal = {
  label: string;
  value: string;
};

export type TopicTestimonial = {
  quote: string;
  author: string;
  role: string;
};

export type TopicLongFormSection = {
  heading: string;
  paragraphs: string[];
};

export type TopicTemplate = {
  slug: string;
  title: string;
  summary: string;
  intentKeywords: string[];
  targetQuery: string;
  supportQueries: string[];
  businessOutcome: string;
  implementationPath: string[];
  ctaLabel: string;
  updatedAt: string;
  author: {
    name: string;
    title: string;
  };
  proofSignals: TopicProofSignal[];
  testimonials: TopicTestimonial[];
  caseGuide: TopicLongFormSection[];
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
    description: "Commercial-intent web engineering playbooks for local service and product businesses.",
    topics: [
      {
        slug: "web-development-in-landshut",
        title: "Web Development in Landshut: Conversion System Blueprint",
        summary:
          "A practical, conversion-first framework for businesses that need a high-performance website and measurable lead generation in Landshut.",
        intentKeywords: [
          "web development in landshut",
          "next.js developer landshut",
          "website redesign for small business germany",
        ],
        targetQuery: "next.js developer landshut",
        supportQueries: [
          "web development in landshut",
          "website redesign for small business germany",
        ],
        businessOutcome: "Higher conversion rate, faster page speed, and more qualified local inbound leads.",
        implementationPath: [
          "Map offer-to-audience fit and define conversion actions per page template.",
          "Build core templates (homepage, service, proof page, contact funnel) with strict CTA hierarchy.",
          "Ship analytics, attribution, and form quality tracking before launch.",
        ],
        ctaLabel: "Plan Your Landshut Website",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Typical launch window", value: "2-5 weeks" },
          { label: "Measured speed target", value: "LCP under 2.5s" },
          { label: "Tracking coverage", value: "Full funnel from landing to form submit" },
        ],
        testimonials: [
          {
            quote:
              "The new structure made our offer clearer and we started receiving better-qualified inquiries within weeks.",
            author: "SMB Owner (Bavaria)",
            role: "Local Service Business",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Most small business websites in regional markets fail for one reason: they are built as digital brochures, not as conversion systems. They often look acceptable but lack strategic structure, semantic content mapping, internal linking depth, and measurable call-to-action flows.",
              "In practical terms, this means users land on a page, scroll briefly, and leave without understanding the offer, the proof behind it, or what to do next. Search engines face a similar issue: weak topical relevance and unclear intent signals result in lower visibility for high-value local queries.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "The first phase is commercial discovery: identifying profitable services, buyer intent patterns, and objection points. From this, each template receives a specific conversion job. A homepage drives service discovery, service pages remove friction, and contact flows capture structured lead quality.",
              "The second phase is production engineering. Pages are built with performance constraints first, then enriched with schema, proof modules, and tightly scoped copy blocks. Internal links are not decorative; each one is designed to move users from awareness to action with minimum cognitive load.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "A modern stack based on Next.js with server rendering enables fast initial loads and strong crawlability. Structured metadata, canonical control, and template-level schema are baked into each route. Image handling is optimized with responsive sizing, modern formats, and clear semantic alt text.",
              "Analytics instrumentation captures page view quality, CTA interactions, and contact funnel progression. Attribution dimensions (source, medium, campaign, landing page, first touch, last touch) are attached to relevant events, enabling business decisions based on pipeline quality, not only traffic volume.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "The intended outcome is not generic traffic growth but improved lead economics: more relevant inquiries, reduced follow-up waste, and predictable conversion performance by page type. This is evaluated through conversion rate by template, form completion quality, and service-level intent segmentation.",
              "When this framework is executed correctly, businesses gain a website that behaves like a sales system: discoverable by search, persuasive for users, and measurable for operators. That is the standard required for sustainable local growth in competitive service markets.",
            ],
          },
        ],
        faqs: [
          {
            question: "How fast can a local business website go live?",
            answer: "A focused MVP with conversion-ready templates usually launches in 2-5 weeks, depending on content readiness.",
          },
          {
            question: "What matters more: design or technical SEO?",
            answer: "Both are required. Design drives trust and conversion, while technical SEO drives discoverability and long-term qualified traffic.",
          },
        ],
      },
      {
        slug: "nextjs-developer-landshut-playbook",
        title: "Next.js Developer Landshut Playbook for Service Businesses",
        summary:
          "A delivery playbook that explains when and why Next.js architecture outperforms no-code stacks for growth-stage service websites.",
        intentKeywords: ["next.js developer landshut", "next.js agency germany", "high performance business website"],
        targetQuery: "next.js developer landshut",
        supportQueries: ["next.js agency germany", "high performance business website"],
        businessOutcome: "Lower maintenance cost and higher long-term conversion stability.",
        implementationPath: [
          "Define template responsibilities and reusable content blocks.",
          "Implement fast-rendering route architecture with stable metadata controls.",
          "Attach tracking and QA guardrails before publication.",
        ],
        ctaLabel: "Get Next.js Delivery Plan",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Template standardization", value: "Service + proof + CTA model" },
          { label: "Quality checks", value: "Metadata and internal-link QA on every route" },
          { label: "Operational fit", value: "Built for iterative updates, not one-off launches" },
        ],
        testimonials: [
          {
            quote: "We finally had a structure we could expand without breaking SEO or user flow.",
            author: "Operations Lead",
            role: "Professional Services",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Many business websites start on systems optimized for speed of setup, not speed of growth. As content, service lines, and tracking needs expand, teams hit limitations in routing control, metadata flexibility, and performance consistency.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "The playbook starts with a strict page taxonomy: revenue pages, trust pages, support content, and conversion endpoints. Each type gets an explicit template and acceptance criteria. This avoids content entropy and protects editorial consistency as the site scales.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Next.js on edge delivery gives high performance, deterministic metadata output, and strong developer control. Combined with structured schema and analytics instrumentation, it enables a system that is both discoverable and commercially measurable.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Teams gain operational speed in content publishing and technical confidence in SEO quality. The result is cleaner indexing, better user progression, and reduced rework costs during service or campaign updates.",
            ],
          },
        ],
        faqs: [
          {
            question: "Is Next.js overkill for a local business?",
            answer: "Not when conversion quality, speed, and scalability matter. It becomes a durable foundation instead of a short-term workaround.",
          },
          {
            question: "Can we migrate in phases?",
            answer: "Yes. Core high-intent pages can be migrated first, followed by supporting content and legacy redirects.",
          },
        ],
      },
      {
        slug: "website-redesign-small-business-germany",
        title: "Website Redesign for Small Business Germany: ROI Framework",
        summary:
          "A redesign framework focused on commercial outcomes instead of purely visual refresh cycles.",
        intentKeywords: [
          "website redesign for small business germany",
          "small business conversion website",
          "service website redesign",
        ],
        targetQuery: "website redesign for small business germany",
        supportQueries: ["small business conversion website", "service website redesign"],
        businessOutcome: "Turn redesign budgets into conversion and pipeline improvements.",
        implementationPath: [
          "Audit current drop-off and intent mismatch points.",
          "Redesign page architecture around decision flow and proof hierarchy.",
          "Validate conversion uplift with funnel instrumentation.",
        ],
        ctaLabel: "Audit My Redesign Scope",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Scope model", value: "Revenue page first, secondary content second" },
          { label: "Validation", value: "Pre/post conversion baseline tracking" },
          { label: "Risk control", value: "SEO-safe routing and canonical planning" },
        ],
        testimonials: [
          {
            quote: "The redesign finally connected brand quality with measurable inquiries.",
            author: "Founder",
            role: "B2B Services",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Redesign projects often fail because they prioritize visuals while preserving weak information architecture and ambiguous conversion paths.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "The framework starts with intent mapping, then redesigns sections by commercial priority: offer clarity, trust reinforcement, and friction-free action flow.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "The redesign is delivered as a template system with strict metadata and schema standards, not isolated page mockups.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "A successful redesign increases lead quality and conversion consistency while lowering maintenance friction for future campaigns.",
            ],
          },
        ],
        faqs: [
          {
            question: "Should we redesign everything at once?",
            answer: "No. Start with high-intent pages and conversion endpoints to de-risk performance and indexing.",
          },
          {
            question: "How do we measure redesign success?",
            answer: "Track conversion rate by template, form quality, and source-level lead outcomes before and after launch.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-automation",
    title: "AI Automation",
    description: "Commercial AI automation systems for inbound operations, qualification, and delivery workflows.",
    topics: [
      {
        slug: "ai-automation-agency-landshut",
        title: "AI Automation Agency Landshut: Lead Ops Architecture",
        summary:
          "How local businesses can implement AI-assisted lead routing, qualification, and follow-up without sacrificing quality control.",
        intentKeywords: ["ai automation agency landshut", "ai automation for small business", "lead qualification automation"],
        targetQuery: "ai automation agency landshut",
        supportQueries: ["ai automation for small business", "lead qualification automation"],
        businessOutcome: "Shorter response times and higher-quality qualified opportunities.",
        implementationPath: [
          "Standardize lead input fields and quality dimensions.",
          "Attach scoring logic and routing thresholds.",
          "Instrument pipeline quality and SLA adherence.",
        ],
        ctaLabel: "Design AI Lead Workflow",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Response-time target", value: "Under 5 minutes for high-priority leads" },
          { label: "Workflow traceability", value: "Every stage logged and auditable" },
          { label: "Quality controls", value: "Human override for critical decisions" },
        ],
        testimonials: [
          {
            quote: "Automation reduced manual triage noise and let sales focus on real opportunities.",
            author: "Commercial Manager",
            role: "Service Company",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Teams lose pipeline quality when inbound leads are handled manually without consistent qualification logic. High-intent leads wait too long, while low-fit inquiries consume disproportionate attention.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Define explicit lead quality criteria, then encode them into event-driven automation. AI helps classify and prioritize, while human teams retain final control on pricing, fit, and contract-sensitive decisions.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "A practical setup combines structured form capture, scoring rules, and CRM handoff logic. Real value comes from instrumentation: response time, acceptance rate, and close-proxy metrics by segment.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Successful implementations typically reduce response latency and increase the share of conversations that match budget and timeline expectations.",
            ],
          },
        ],
        faqs: [
          {
            question: "Does AI replace sales qualification?",
            answer: "No. It accelerates triage and consistency while humans make final qualification and deal decisions.",
          },
          {
            question: "What is the minimum data needed?",
            answer: "Source, project type, budget range, timeline, and decision urgency are the minimum useful fields.",
          },
        ],
      },
      {
        slug: "ai-automation-funnel-tracking",
        title: "AI Automation Funnel Tracking: Event Taxonomy Standard",
        summary:
          "A robust event model for tracking automated lead flows from acquisition to submission quality.",
        intentKeywords: ["ai funnel analytics", "event taxonomy for automation", "attribution for ai workflows"],
        targetQuery: "event taxonomy for automation",
        supportQueries: ["ai funnel analytics", "attribution for ai workflows"],
        businessOutcome: "Clear visibility into drop-off, source quality, and automation impact.",
        implementationPath: [
          "Define event naming governance and payload standards.",
          "Track form progression and handoff outcomes.",
          "Build acquisition + sales-intent dashboards.",
        ],
        ctaLabel: "Set Up Event Taxonomy",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Funnel depth", value: "Landing > CTA > steps > submit" },
          { label: "Attribution model", value: "First touch + last touch persisted" },
          { label: "Quality fields", value: "Budget, timeline, scope, promotion tier" },
        ],
        testimonials: [
          {
            quote: "Tracking structure gave us the confidence to optimize by quality, not vanity traffic.",
            author: "Growth Lead",
            role: "Digital Agency",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Without a strict taxonomy, analytics data becomes fragmented and difficult to trust. Teams can see activity but cannot explain why conversion quality changes.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Define canonical event names, payload keys, and ownership rules. Every event should answer a business question and map to a specific stage in the pipeline.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Use centralized tracking hooks, structured labels, and route-level enrichment. Pair this with dashboard slices for acquisition efficiency and sales-intent quality.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Decision quality improves when teams can isolate which channel, page template, or workflow step produces high-fit leads.",
            ],
          },
        ],
        faqs: [
          {
            question: "What should we track first?",
            answer: "Track service views, CTA clicks, form starts, step progression, submissions, and quality dimensions.",
          },
          {
            question: "How often should dashboards be reviewed?",
            answer: "Weekly for tactical optimization, monthly for strategy changes.",
          },
        ],
      },
      {
        slug: "ai-automation-implementation-roadmap",
        title: "AI Automation Implementation Roadmap for SMB Teams",
        summary:
          "A staged roadmap for deploying AI automation safely with measurable business checkpoints.",
        intentKeywords: ["ai automation roadmap", "ai implementation smb", "workflow automation strategy"],
        targetQuery: "ai automation roadmap",
        supportQueries: ["ai implementation smb", "workflow automation strategy"],
        businessOutcome: "Controlled rollout with lower risk and faster value realization.",
        implementationPath: [
          "Pilot one revenue-critical workflow.",
          "Measure baseline versus post-automation outcomes.",
          "Scale only validated patterns into adjacent processes.",
        ],
        ctaLabel: "Start AI Roadmap",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Rollout model", value: "Pilot > validate > scale" },
          { label: "Risk controls", value: "Human checkpoints on high-impact transitions" },
          { label: "Operational KPI", value: "Latency, qualification, and throughput" },
        ],
        testimonials: [
          {
            quote: "The staged rollout prevented disruption and gave us measurable wins quickly.",
            author: "Operations Director",
            role: "SMB Team",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Large automation rollouts fail when teams try to redesign every process at once. Complexity rises faster than capability, and confidence drops.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Start with a single workflow where speed and consistency have direct commercial impact. Set measurable acceptance criteria before implementation.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Use modular components: intake, scoring, routing, and reporting. Keep each module independently testable and reversible.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Validated pilots become reusable playbooks, reducing risk and accelerating expansion into adjacent operations.",
            ],
          },
        ],
        faqs: [
          {
            question: "How long should a pilot run?",
            answer: "Usually 2-6 weeks, long enough to measure stability and conversion quality changes.",
          },
          {
            question: "When should we scale to additional workflows?",
            answer: "Only after the pilot has clear KPI improvements and documented operational reliability.",
          },
        ],
      },
    ],
  },
  {
    slug: "ecommerce-development",
    title: "E-Commerce Development",
    description: "Conversion-focused e-commerce architecture and growth workflows for catalog businesses.",
    topics: [
      {
        slug: "ecommerce-development-in-landshut",
        title: "E-Commerce Development in Landshut: Revenue Architecture",
        summary:
          "A practical architecture for local and regional e-commerce businesses that need scalable catalogs and reliable checkout performance.",
        intentKeywords: ["e-commerce development in landshut", "shop development germany", "checkout optimization ecommerce"],
        targetQuery: "e-commerce development in landshut",
        supportQueries: ["shop development germany", "checkout optimization ecommerce"],
        businessOutcome: "Higher checkout completion and stronger product discovery performance.",
        implementationPath: [
          "Map category and product intent structure.",
          "Design checkout flow with measurable friction checkpoints.",
          "Instrument product-list and checkout funnel analytics.",
        ],
        ctaLabel: "Plan E-Commerce Build",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Checkout KPI", value: "Completion rate by device and source" },
          { label: "Catalog SEO", value: "Collection + product index coverage" },
          { label: "Operational goal", value: "Stable performance during campaign peaks" },
        ],
        testimonials: [
          {
            quote: "The new architecture gave us cleaner category discovery and fewer checkout drop-offs.",
            author: "E-Commerce Manager",
            role: "Retail Brand",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Many stores optimize visual design but neglect discoverability and conversion instrumentation. This causes weak organic visibility and unclear reasons for cart abandonment.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Start with intent-based taxonomy, then align category pages, product templates, and checkout flow around measurable user decisions.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "A modern storefront architecture separates speed-critical front-end rendering from admin operations while preserving analytics integrity.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Improved product-list click-through and checkout completion provide direct revenue impact and cleaner growth forecasting.",
            ],
          },
        ],
        faqs: [
          {
            question: "What should be optimized first in e-commerce?",
            answer: "Start with product discovery and checkout friction, because these influence both traffic quality and revenue efficiency.",
          },
          {
            question: "Can SEO and conversion be improved together?",
            answer: "Yes. Intent-matched category structures improve discoverability while clearer navigation improves user progression.",
          },
        ],
      },
      {
        slug: "ecommerce-checkout-conversion-framework",
        title: "E-Commerce Checkout Conversion Framework",
        summary:
          "A practical framework for diagnosing and reducing checkout abandonment.",
        intentKeywords: ["checkout conversion framework", "reduce cart abandonment", "ecommerce funnel tracking"],
        targetQuery: "reduce cart abandonment",
        supportQueries: ["checkout conversion framework", "ecommerce funnel tracking"],
        businessOutcome: "More completed transactions from existing traffic.",
        implementationPath: [
          "Map failure points by device and payment step.",
          "Prioritize friction fixes with revenue impact scoring.",
          "Measure uplift by cohort after each release.",
        ],
        ctaLabel: "Audit Checkout Funnel",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Funnel depth", value: "Cart > details > payment > confirmation" },
          { label: "Analysis lens", value: "Device, channel, and payment method" },
          { label: "Iteration cycle", value: "Weekly release with measured deltas" },
        ],
        testimonials: [
          {
            quote: "Small checkout changes delivered immediate revenue gains once tracking was structured properly.",
            author: "Growth Specialist",
            role: "DTC Brand",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Checkout optimization fails when teams rely on assumptions instead of stage-level evidence.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Instrument each step, isolate high-loss transitions, and prioritize interventions by expected revenue recovery.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Use event-level instrumentation tied to transaction outcomes, with clean attribution context preserved.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "The framework converts unclear checkout behavior into actionable optimization backlog with financial relevance.",
            ],
          },
        ],
        faqs: [
          {
            question: "How much data is needed before making changes?",
            answer: "Use enough sessions to detect stable patterns, then run controlled updates with before/after measurement.",
          },
          {
            question: "What if checkout is handled by third-party providers?",
            answer: "Track pre-handoff and post-handoff milestones so provider constraints do not hide conversion losses.",
          },
        ],
      },
      {
        slug: "ecommerce-seo-category-architecture",
        title: "E-Commerce SEO Category Architecture for Commercial Intent",
        summary:
          "How to structure category, collection, and support content for scalable index quality and buyer intent alignment.",
        intentKeywords: ["ecommerce category seo", "collection page seo", "commercial intent ecommerce"],
        targetQuery: "ecommerce category seo",
        supportQueries: ["collection page seo", "commercial intent ecommerce"],
        businessOutcome: "Higher-quality organic sessions with stronger product discovery behavior.",
        implementationPath: [
          "Design category hierarchy around demand clusters.",
          "Align metadata and schema to each intent layer.",
          "Link category pages to supporting guides and trust pages.",
        ],
        ctaLabel: "Design Category SEO",
        updatedAt: "2026-03-26",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Indexing focus", value: "Only unique value pages indexed" },
          { label: "Schema coverage", value: "Product + Breadcrumb + FAQ where relevant" },
          { label: "Internal links", value: "Category to product to support-guide paths" },
        ],
        testimonials: [
          {
            quote: "Category restructuring improved both ranking relevance and on-site product exploration.",
            author: "SEO Manager",
            role: "E-Commerce Team",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Unstructured category systems create duplicate intent pages and weak crawl prioritization.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Build a demand-led taxonomy, map each category to distinct intent, then enforce metadata and internal linking standards.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Template-driven rendering with strict canonical and structured-data rules prevents indexing drift as catalogs scale.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Improved index quality and session relevance increase the probability of conversion from organic traffic.",
            ],
          },
        ],
        faqs: [
          {
            question: "Should every filter page be indexed?",
            answer: "No. Index only pages with unique demand and clear user value to avoid crawl waste and duplication.",
          },
          {
            question: "How often should category metadata be reviewed?",
            answer: "Review monthly and after major catalog or campaign changes.",
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

function isProofSignal(value: unknown): value is TopicProofSignal {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.label === "string" && typeof entry.value === "string";
}

function isTestimonial(value: unknown): value is TopicTestimonial {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.quote === "string" && typeof entry.author === "string" && typeof entry.role === "string";
}

function isLongFormSection(value: unknown): value is TopicLongFormSection {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.heading === "string" &&
    Array.isArray(entry.paragraphs) &&
    entry.paragraphs.every((paragraph) => typeof paragraph === "string")
  );
}

function isTopicTemplate(value: unknown): value is TopicTemplate {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  const author = entry.author as Record<string, unknown> | undefined;

  return (
    typeof entry.slug === "string" &&
    typeof entry.title === "string" &&
    typeof entry.summary === "string" &&
    Array.isArray(entry.intentKeywords) &&
    entry.intentKeywords.every((keyword) => typeof keyword === "string") &&
    typeof entry.targetQuery === "string" &&
    Array.isArray(entry.supportQueries) &&
    entry.supportQueries.every((query) => typeof query === "string") &&
    typeof entry.businessOutcome === "string" &&
    Array.isArray(entry.implementationPath) &&
    entry.implementationPath.every((step) => typeof step === "string") &&
    typeof entry.ctaLabel === "string" &&
    typeof entry.updatedAt === "string" &&
    !!author &&
    typeof author.name === "string" &&
    typeof author.title === "string" &&
    Array.isArray(entry.proofSignals) &&
    entry.proofSignals.every((proof) => isProofSignal(proof)) &&
    Array.isArray(entry.testimonials) &&
    entry.testimonials.every((testimonial) => isTestimonial(testimonial)) &&
    Array.isArray(entry.caseGuide) &&
    entry.caseGuide.every((section) => isLongFormSection(section)) &&
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
  const parsed = parseTopicClusters(value);
  if (!parsed) return TOPIC_CLUSTERS;

  const parsedBySlug = new Map(parsed.map((cluster) => [cluster.slug, cluster]));
  const merged = TOPIC_CLUSTERS.map((defaultCluster) => {
    const parsedCluster = parsedBySlug.get(defaultCluster.slug);
    if (!parsedCluster) return defaultCluster;

    const parsedTopicsBySlug = new Map(parsedCluster.topics.map((topic) => [topic.slug, topic]));
    const mergedTopics = defaultCluster.topics.map((defaultTopic) => parsedTopicsBySlug.get(defaultTopic.slug) ?? defaultTopic);
    const extraParsedTopics = parsedCluster.topics.filter(
      (topic) => !defaultCluster.topics.some((defaultTopic) => defaultTopic.slug === topic.slug),
    );

    return {
      ...defaultCluster,
      ...parsedCluster,
      topics: [...mergedTopics, ...extraParsedTopics],
    };
  });

  const extraParsedClusters = parsed.filter(
    (cluster) => !TOPIC_CLUSTERS.some((defaultCluster) => defaultCluster.slug === cluster.slug),
  );

  return [...merged, ...extraParsedClusters];
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
