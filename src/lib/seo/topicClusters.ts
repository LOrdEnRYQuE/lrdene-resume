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
      {
        slug: "web-development-in-munich",
        title: "Web Development in Munich: Commercial Site Blueprint",
        summary:
          "A conversion-driven website blueprint for Munich service and product businesses that need measurable inbound growth.",
        intentKeywords: ["web development in munich", "next.js developer munich", "business website munich"],
        targetQuery: "web development in munich",
        supportQueries: ["next.js developer munich", "business website munich"],
        businessOutcome: "More qualified inbound leads from high-intent local search and clearer CTA progression.",
        implementationPath: [
          "Define revenue pages by offer and buying stage.",
          "Implement high-performance templates with proof-first layout blocks.",
          "Track attribution, CTA engagement, and lead quality by route.",
        ],
        ctaLabel: "Plan Your Munich Website",
        updatedAt: "2026-03-27",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Launch model", value: "MVP-first with measurable release checkpoints" },
          { label: "Performance target", value: "Sub-2.5s LCP on core templates" },
          { label: "Funnel visibility", value: "Track source-to-submit quality signals" },
        ],
        testimonials: [
          {
            quote: "The new architecture made acquisition measurable and improved lead quality in the first month.",
            author: "Managing Director",
            role: "Munich Service Business",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Many local websites underperform because they are designed without intent mapping and measurable conversion flow.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Map user intent to page templates, then structure proof and action hierarchy for each stage of decision-making.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Use a performance-first Next.js stack with schema coverage, canonical discipline, and tracked CTA pathways.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Higher intent-match conversion and stronger channel-level decision quality for ongoing growth operations.",
            ],
          },
        ],
        faqs: [
          {
            question: "How long does this type of rollout usually take?",
            answer: "Most focused local-business builds launch in 2-6 weeks depending on content and review cycles.",
          },
          {
            question: "Can this framework work for multilingual markets?",
            answer: "Yes, if route-level localization and canonical strategy are defined from the start.",
          },
        ],
      },
      {
        slug: "web-development-in-berlin",
        title: "Web Development in Berlin: Scalable Conversion Framework",
        summary:
          "A framework for Berlin-based businesses that need high-performance web delivery with reliable conversion instrumentation.",
        intentKeywords: ["web development in berlin", "next.js developer berlin", "conversion website berlin"],
        targetQuery: "web development in berlin",
        supportQueries: ["next.js developer berlin", "conversion website berlin"],
        businessOutcome: "Improved conversion consistency and clearer pipeline visibility for growth teams.",
        implementationPath: [
          "Define commercial template system and offer hierarchy.",
          "Implement speed, metadata, and schema standards on every route.",
          "Launch with event taxonomy tied to pipeline quality.",
        ],
        ctaLabel: "Build Berlin Growth Site",
        updatedAt: "2026-03-27",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Template quality", value: "Offer, proof, and CTA standards by page type" },
          { label: "Measurement depth", value: "Page intent and conversion-stage tracking" },
          { label: "Operational fit", value: "Designed for iterative campaign updates" },
        ],
        testimonials: [
          {
            quote: "The framework gave us stronger page clarity and better lead qualification from organic traffic.",
            author: "Growth Lead",
            role: "Berlin B2B Company",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Sites built without technical and commercial alignment struggle to scale content while preserving conversion quality.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Align service and trust templates to buyer intent, then standardize internal linking and CTA transitions.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Production-ready Next.js architecture with deterministic metadata output and structured event tracking.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Cleaner indexing, better on-page progression, and stronger source-level performance decisions.",
            ],
          },
        ],
        faqs: [
          {
            question: "Is this framework suitable for fast-moving startups?",
            answer: "Yes. It is designed for iterative shipping while preserving technical SEO and measurement quality.",
          },
          {
            question: "What is the first KPI to monitor after launch?",
            answer: "Track qualified submit rate by landing template and acquisition channel.",
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
      {
        slug: "ai-automation-agency-frankfurt",
        title: "AI Automation Agency Frankfurt: Revenue Ops Playbook",
        summary:
          "A practical playbook for Frankfurt teams deploying AI-assisted qualification, routing, and follow-up workflows.",
        intentKeywords: ["ai automation agency frankfurt", "ai lead qualification frankfurt", "workflow automation consulting"],
        targetQuery: "ai automation agency frankfurt",
        supportQueries: ["ai lead qualification frankfurt", "workflow automation consulting"],
        businessOutcome: "Faster lead response and improved qualification consistency across channels.",
        implementationPath: [
          "Standardize inbound fields and qualification criteria.",
          "Implement AI-assisted routing with human override checkpoints.",
          "Track SLA and conversion-quality outcomes by segment.",
        ],
        ctaLabel: "Plan Frankfurt AI Workflow",
        updatedAt: "2026-03-27",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "SLA objective", value: "First response under 10 minutes for high-intent leads" },
          { label: "Governance", value: "Documented rule sets and escalation paths" },
          { label: "Visibility", value: "End-to-end tracking from source to status updates" },
        ],
        testimonials: [
          {
            quote: "Response speed improved immediately and sales spent less time on low-fit inquiries.",
            author: "Head of Operations",
            role: "Frankfurt Services Team",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Manual triage introduces variability and latency, especially when inbound volume increases across channels.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Translate qualification logic into structured automation with clear ownership and exception handling.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Combine form capture, scoring, routing, and reporting modules with robust event governance.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Higher fit-rate conversations and more predictable commercial throughput.",
            ],
          },
        ],
        faqs: [
          {
            question: "Do we need a CRM migration first?",
            answer: "No. Start with integration adapters and controlled workflows before larger system changes.",
          },
          {
            question: "What should be automated first?",
            answer: "Begin with intake, qualification scoring, and first-touch routing for highest immediate impact.",
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
      {
        slug: "ecommerce-development-in-hamburg",
        title: "E-Commerce Development in Hamburg: Conversion Engineering",
        summary:
          "A conversion engineering blueprint for Hamburg e-commerce teams focused on catalog discovery and checkout reliability.",
        intentKeywords: ["e-commerce development in hamburg", "shop development hamburg", "checkout optimization hamburg"],
        targetQuery: "e-commerce development in hamburg",
        supportQueries: ["shop development hamburg", "checkout optimization hamburg"],
        businessOutcome: "Higher checkout completion and improved product-list engagement.",
        implementationPath: [
          "Align category architecture with demand clusters.",
          "Reduce checkout friction through stage-level diagnostics.",
          "Measure conversion uplift by channel and device cohort.",
        ],
        ctaLabel: "Plan Hamburg E-Commerce Build",
        updatedAt: "2026-03-27",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Checkout monitoring", value: "Track abandonment at each payment stage" },
          { label: "Catalog quality", value: "Intent-aligned category and product templates" },
          { label: "Commercial lens", value: "Revenue-oriented release prioritization" },
        ],
        testimonials: [
          {
            quote: "We improved checkout progression and gained clearer insight into product-page performance.",
            author: "E-Commerce Lead",
            role: "Hamburg Retail Brand",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Revenue losses often come from unmeasured checkout friction and weak product discovery structure.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Model intent by category, then apply stage-level instrumentation and prioritized friction fixes.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Template-driven architecture with strong metadata control and event-based conversion monitoring.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Improved conversion rate stability and better forecasting confidence for campaign operations.",
            ],
          },
        ],
        faqs: [
          {
            question: "Where should we start optimization first?",
            answer: "Start with the highest-drop checkout step and highest-traffic category entry pages.",
          },
          {
            question: "Can we improve conversion without a full rebuild?",
            answer: "Yes. Structured instrumentation and targeted fixes usually deliver fast gains before full redesign.",
          },
        ],
      },
      {
        slug: "ecommerce-development-in-stuttgart",
        title: "E-Commerce Development in Stuttgart: Scale-Ready Store Framework",
        summary:
          "A scale-ready framework for Stuttgart e-commerce teams that need faster iteration and conversion-safe growth.",
        intentKeywords: ["e-commerce development in stuttgart", "shopify development stuttgart", "ecommerce performance stuttgart"],
        targetQuery: "e-commerce development in stuttgart",
        supportQueries: ["shopify development stuttgart", "ecommerce performance stuttgart"],
        businessOutcome: "More reliable conversion growth with lower operational rework.",
        implementationPath: [
          "Define scalable category and product template standards.",
          "Instrument checkout and post-purchase events for decision quality.",
          "Ship prioritized CRO iterations with cohort-level measurement.",
        ],
        ctaLabel: "Build Stuttgart Store Roadmap",
        updatedAt: "2026-03-27",
        author: {
          name: "Attila Lazar",
          title: "Founder, LOrdEnRYQuE | Full-Stack & AI Engineer",
        },
        proofSignals: [
          { label: "Iteration cadence", value: "Weekly measured CRO releases" },
          { label: "Performance target", value: "Fast category and PDP load across devices" },
          { label: "Reporting", value: "Cohort-level conversion and abandonment insights" },
        ],
        testimonials: [
          {
            quote: "The framework made optimization predictable and reduced random experimentation.",
            author: "Growth Manager",
            role: "Stuttgart Commerce Team",
          },
        ],
        caseGuide: [
          {
            heading: "Problem",
            paragraphs: [
              "Teams struggle to scale when storefront changes are shipped without structured priorities and reliable measurement.",
            ],
          },
          {
            heading: "Process",
            paragraphs: [
              "Set template and instrumentation standards first, then iterate via impact-scored optimization backlog.",
            ],
          },
          {
            heading: "Stack",
            paragraphs: [
              "Use a composable storefront model with robust analytics and controlled deployment flow.",
            ],
          },
          {
            heading: "Measurable Result",
            paragraphs: [
              "Stronger conversion trend stability and clearer ROI from ongoing development sprints.",
            ],
          },
        ],
        faqs: [
          {
            question: "How do we prioritize CRO work?",
            answer: "Use impact and confidence scoring tied to measured drop-off points and revenue contribution.",
          },
          {
            question: "What KPI should lead weekly reviews?",
            answer: "Track conversion by device and step-level abandonment with channel breakdowns.",
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
