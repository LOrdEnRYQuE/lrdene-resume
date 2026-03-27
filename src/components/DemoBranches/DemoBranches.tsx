import styles from "./DemoBranches.module.css";
import {
  Utensils, 
  Scissors, 
  Home, 
  Scale, 
  Wrench, 
  ShoppingBag,
  ArrowUpRight,
  Activity,
  BookOpen,
  PieChart,
  Navigation,
  Rocket,
  QrCode
} from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const demos = [
  {
    title: "Restaurant MVP",
    description: "Modern booking + menu + admin flow for hospitality.",
    icon: <Utensils size={24} />,
    slug: "restaurant",
    stack: ["Next.js", "Convex", "Booking UX"],
  },
  {
    title: "Salon & Barber",
    description: "Appointment scheduling and service showcase.",
    icon: <Scissors size={24} />,
    slug: "salon",
    stack: ["Scheduler", "CRM-ready", "Mobile-first"],
  },
  {
    title: "Real Estate",
    description: "Premium property listings and agent dashboards.",
    icon: <Home size={24} />,
    slug: "real-estate",
    stack: ["Search", "Map UX", "Lead Forms"],
  },
  {
    title: "Lawyer & Consultant",
    description: "Secure case management and client portals.",
    icon: <Scale size={24} />,
    slug: "lawyer",
    stack: ["Client Portal", "Docs", "Audit Trail"],
  },
  {
    title: "Home Services",
    description: "Job tracking and invoice management for contractors.",
    icon: <Wrench size={24} />,
    slug: "home-services",
    stack: ["Field Ops", "Invoicing", "Scheduling"],
  },
  {
    title: "E-commerce",
    description: "High-conversion product stores and inventory tools.",
    icon: <ShoppingBag size={24} />,
    slug: "ecommerce",
    stack: ["Checkout", "Catalog", "Analytics"],
  },
  {
    title: "uTraLink QR SaaS",
    description: "Digital business cards, BioLinks, and dynamic QR workflows.",
    icon: <QrCode size={24} />,
    slug: "utralink",
    stack: ["Laravel", "PHP", "QR Platform"],
  },
  {
    title: "AI Dashboard",
    description: "SaaS Analytics & Monitoring.",
    icon: <PieChart size={24} />,
    slug: "ai-dashboard",
    stack: ["Realtime", "Monitoring", "Convex"],
  },
  {
    title: "Course Platform",
    description: "Learning Management System.",
    icon: <BookOpen size={24} />,
    slug: "course-platform",
    stack: ["LMS", "Progress", "Auth"],
  },
  {
    title: "Healthcare Portal",
    description: "Secure Patient Records.",
    icon: <Activity size={24} />,
    slug: "healthcare",
    stack: ["Secure Access", "Records", "Telehealth"],
  },
  {
    title: "Logistics System",
    description: "Fleet & Supply Tracking.",
    icon: <Navigation size={24} />,
    slug: "logistics",
    stack: ["Tracking", "Route Ops", "Dispatch"],
  },
  {
    title: "SaaS Landing",
    description: "Product Launch Boilerplate.",
    icon: <Rocket size={24} />,
    slug: "saas-landing",
    stack: ["CRO", "SEO", "Launch Pages"],
  },
  {
    title: "AI Agents",
    description: "Autonomous assistants for support and workflow ops.",
    icon: <Rocket size={24} />,
    slug: "ai-agents",
    stack: ["LLM Agents", "Convex", "Knowledge Base"],
  },
  {
    title: "AI Marketplace",
    description: "Deploy and evaluate specialized AI agents.",
    icon: <PieChart size={24} />,
    slug: "ai-marketplace",
    stack: ["Marketplace", "DevTools", "Integrations"],
  },
  {
    title: "AI SEO / GEO",
    description: "Track visibility across AI engines and search.",
    icon: <PieChart size={24} />,
    slug: "ai-seo",
    stack: ["SEO", "GEO", "Content Intelligence"],
  },
  {
    title: "Architecture Studio",
    description: "Generative design and spatial visualization.",
    icon: <Home size={24} />,
    slug: "architecture",
    stack: ["3D Preview", "Design Systems", "AI"],
  },
  {
    title: "Finance Broker",
    description: "Consultation funnel with market and lead ops.",
    icon: <Scale size={24} />,
    slug: "broker",
    stack: ["Lead Routing", "Advisory", "Compliance UX"],
  },
  {
    title: "Construction Suite",
    description: "Project showcase and qualification flow.",
    icon: <Wrench size={24} />,
    slug: "construction",
    stack: ["Project Pipeline", "Service Area", "Blueprint UX"],
  },
  {
    title: "Auto Dealer",
    description: "Vehicle showcase and test-drive conversion flow.",
    icon: <Navigation size={24} />,
    slug: "car-dealer",
    stack: ["Inventory", "Booking", "Finance Calculator"],
  },
  {
    title: "Auto Detailing",
    description: "Package-based booking and upsell structure.",
    icon: <Navigation size={24} />,
    slug: "car-detailing",
    stack: ["Service Packages", "Scheduler", "Upsell Blocks"],
  },
  {
    title: "Auto Selling",
    description: "AI valuation and instant offer funnel.",
    icon: <Navigation size={24} />,
    slug: "car-selling",
    stack: ["AI Valuation", "FinTech", "Lead Qualification"],
  },
  {
    title: "Mental Wellness",
    description: "Companion-style wellness journaling experience.",
    icon: <Activity size={24} />,
    slug: "mental-health",
    stack: ["Sentiment Flow", "AI Companion", "Habit UX"],
  },
  {
    title: "Green Commerce",
    description: "Eco-focused marketplace with impact signals.",
    icon: <ShoppingBag size={24} />,
    slug: "green-eco",
    stack: ["Sustainability", "Marketplace", "Score Cards"],
  },
];

type DemoBranchesProps = {
  locale: Locale;
};

export const DemoBranches = ({ locale }: DemoBranchesProps) => {
  const localePrefix = locale === "de" ? "/de" : "/en";
  const copy =
    locale === "de"
      ? {
          titlePrefix: "Interaktive",
          titleAccent: "Demo Branches",
          subtitle:
            "Teste diese spezialisierten Business-Systeme. Jede Demo ist ein funktionales MVP für reale Branchenprobleme.",
          openDemo: "Demo Öffnen",
          allDemos: "Alle Demos ansehen",
        }
      : {
          titlePrefix: "Interactive",
          titleAccent: "Demo Branches",
          subtitle:
            "Test-drive these specialized business systems. Each one is a functional MVP built to solve real industry challenges.",
          openDemo: "Open Demo",
          allDemos: "View all demos",
        };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            {copy.titlePrefix} <span className="gold-text">{copy.titleAccent}</span>
          </h2>
          <p className={styles.subtitle}>
            {copy.subtitle}
          </p>
        </div>

        <div className={styles.grid}>
          {demos.map((demo) => (
            <div 
              key={demo.title}
              className={styles.card}
            >
              <div className={styles.iconWrapper}>
                {demo.icon}
              </div>
              <h3 className={styles.cardTitle}>{demo.title}</h3>
              <p className={styles.cardDescription}>{demo.description}</p>
              <div className={styles.stackRow}>
                {demo.stack.map((item) => (
                  <span key={`${demo.slug}-${item}`} className={styles.stackPill}>
                    {item}
                  </span>
                ))}
              </div>
              
              <div className={styles.footer}>
                <Link
                  href={`${localePrefix}/demos/${demo.slug}`}
                  className={styles.demoBtn}
                  data-track-event="open_demo"
                  data-track-label={`Demo opened: ${demo.title}`}
                >
                  {copy.openDemo} <ArrowUpRight size={14} style={{ marginLeft: "4px" }} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.moreWrap}>
          <Link href={`${localePrefix}/demos`} className={styles.moreBtn}>
            {copy.allDemos}
          </Link>
        </div>
      </div>
    </section>
  );
};
