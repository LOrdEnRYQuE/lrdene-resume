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
  Rocket
} from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const demos = [
  {
    title: "Restaurant MVP",
    description: "Modern booking + menu + admin flow for hospitality.",
    icon: <Utensils size={24} />,
    slug: "restaurant",
  },
  {
    title: "Salon & Barber",
    description: "Appointment scheduling and service showcase.",
    icon: <Scissors size={24} />,
    slug: "salon",
  },
  {
    title: "Real Estate",
    description: "Premium property listings and agent dashboards.",
    icon: <Home size={24} />,
    slug: "real-estate",
  },
  {
    title: "Lawyer & Consultant",
    description: "Secure case management and client portals.",
    icon: <Scale size={24} />,
    slug: "lawyer",
  },
  {
    title: "Home Services",
    description: "Job tracking and invoice management for contractors.",
    icon: <Wrench size={24} />,
    slug: "home-services",
  },
  {
    title: "E-commerce",
    description: "High-conversion product stores and inventory tools.",
    icon: <ShoppingBag size={24} />,
    slug: "ecommerce",
  },
  {
    title: "AI Dashboard",
    description: "SaaS Analytics & Monitoring.",
    icon: <PieChart size={24} />,
    slug: "ai-dashboard",
  },
  {
    title: "Course Platform",
    description: "Learning Management System.",
    icon: <BookOpen size={24} />,
    slug: "course-platform",
  },
  {
    title: "Healthcare Portal",
    description: "Secure Patient Records.",
    icon: <Activity size={24} />,
    slug: "healthcare",
  },
  {
    title: "Logistics System",
    description: "Fleet & Supply Tracking.",
    icon: <Navigation size={24} />,
    slug: "logistics",
  },
  {
    title: "SaaS Landing",
    description: "Product Launch Boilerplate.",
    icon: <Rocket size={24} />,
    slug: "saas-landing",
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
