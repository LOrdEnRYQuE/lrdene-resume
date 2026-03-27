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
  QrCode,
} from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

type DemoRecord = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  techStack?: string[];
};

const fallbackDemos = [
  {
    name: "Restaurant MVP",
    description: "Modern booking + menu + admin flow for hospitality.",
    slug: "restaurant",
    techStack: ["Next.js", "Convex", "Booking UX"],
    category: "Hospitality",
  },
  {
    name: "Salon & Barber",
    description: "Appointment scheduling and service showcase.",
    slug: "salon",
    techStack: ["Scheduler", "CRM-ready", "Mobile-first"],
    category: "Beauty & Wellness",
  },
  {
    name: "Real Estate",
    description: "Premium property listings and agent dashboards.",
    slug: "real-estate",
    techStack: ["Search", "Map UX", "Lead Forms"],
    category: "Real Estate",
  },
  {
    name: "Lawyer & Consultant",
    description: "Secure case management and client portals.",
    slug: "lawyer",
    techStack: ["Client Portal", "Docs", "Audit Trail"],
    category: "Legal & Consulting",
  },
  {
    name: "Home Services",
    description: "Job tracking and invoice management for contractors.",
    slug: "home-services",
    techStack: ["Field Ops", "Invoicing", "Scheduling"],
    category: "Home Services",
  },
  {
    name: "E-commerce",
    description: "High-conversion product stores and inventory tools.",
    slug: "ecommerce",
    techStack: ["Checkout", "Catalog", "Analytics"],
    category: "E-commerce",
  },
  {
    name: "uTraLink QR SaaS",
    description: "Digital business cards, BioLinks, and dynamic QR workflows.",
    slug: "utralink",
    techStack: ["Laravel", "PHP", "QR Platform"],
    category: "SaaS",
  },
];

type DemoBranchesProps = {
  locale: Locale;
};

function getDemoIcon(slug: string, category: string) {
  const key = `${slug} ${category}`.toLowerCase();
  if (slug === "utralink" || key.includes("qr")) return <QrCode size={24} />;
  if (key.includes("restaurant") || key.includes("hospitality")) return <Utensils size={24} />;
  if (key.includes("salon") || key.includes("wellness")) return <Scissors size={24} />;
  if (key.includes("real estate") || key.includes("architecture")) return <Home size={24} />;
  if (key.includes("law") || key.includes("legal") || key.includes("broker") || key.includes("finance")) return <Scale size={24} />;
  if (key.includes("construction") || key.includes("home services")) return <Wrench size={24} />;
  if (key.includes("e-commerce") || key.includes("commerce") || key.includes("marketplace")) return <ShoppingBag size={24} />;
  if (key.includes("health")) return <Activity size={24} />;
  if (key.includes("course") || key.includes("edutech")) return <BookOpen size={24} />;
  if (key.includes("logistics") || key.includes("automotive")) return <Navigation size={24} />;
  if (key.includes("ai")) return <PieChart size={24} />;
  if (key.includes("saas")) return <Rocket size={24} />;
  return <Rocket size={24} />;
}

export const DemoBranches = async ({ locale }: DemoBranchesProps) => {
  const localePrefix = locale === "de" ? "/de" : "/en";
  const dbDemos = (await fetchQuery(api.demos.list)) as DemoRecord[] | null;
  const demos = dbDemos && dbDemos.length > 0 ? dbDemos : fallbackDemos;
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
            <div key={demo.slug} className={styles.card}>
              <div className={styles.iconWrapper}>
                {getDemoIcon(demo.slug, demo.category)}
              </div>
              <h3 className={styles.cardTitle}>{demo.name}</h3>
              <p className={styles.cardDescription}>{demo.description}</p>
              <div className={styles.stackRow}>
                {(demo.techStack ?? []).slice(0, 3).map((item) => (
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
                  data-track-label={`Demo opened: ${demo.name}`}
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
