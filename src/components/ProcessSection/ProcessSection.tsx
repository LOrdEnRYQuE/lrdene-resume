import React from "react";
import styles from "./ProcessSection.module.css";
import { Search, Paintbrush, Code2, Rocket, BarChart3 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Deep dive into your business goals, target audience, and challenges.",
    icon: <Search size={18} />,
  },
  {
    number: "02",
    title: "Design",
    description: "Crafting a premium visual direction and a seamless user experience.",
    icon: <Paintbrush size={18} />,
  },
  {
    number: "03",
    title: "Build",
    description: "Clean, performant code using Next.js and high-end backend microservices.",
    icon: <Code2 size={18} />,
  },
  {
    number: "04",
    title: "Launch",
    description: "SEO optimization, GEO metadata, and deployment to a secure global edge.",
    icon: <Rocket size={18} />,
  },
  {
    number: "05",
    title: "Improve",
    description: "Ongoing performance audits, conversion tracking, and iterations.",
    icon: <BarChart3 size={18} />,
  },
];

type ProcessSectionProps = {
  locale: Locale;
};

export const ProcessSection = ({ locale }: ProcessSectionProps) => {
  const copy =
    locale === "de"
      ? {
          eyebrow: "So läuft es",
          title: "Der",
          titleAccent: "Prozess",
          subtitle:
            "Ein disziplinierter 5-Phasen-Ansatz, der aus deiner Idee ein hochwertiges Live-Produkt macht.",
        }
      : {
          eyebrow: "How it works",
          title: "The",
          titleAccent: "Process",
          subtitle:
            "A disciplined, five-stage framework that turns your idea into a polished, live product.",
        };

  const localizedSteps =
    locale === "de"
      ? [
          { ...steps[0], title: "Verstehen", description: "Tiefer Einblick in Ziele, Zielgruppe und Herausforderungen." },
          { ...steps[1], title: "Design", description: "Premium Designrichtung und nahtlose User Experience." },
          { ...steps[2], title: "Build", description: "Sauberer, performanter Code mit Next.js und robustem Backend." },
          { ...steps[3], title: "Launch", description: "SEO-Optimierung, Metadaten und sicheres Global-Edge Deployment." },
          { ...steps[4], title: "Optimieren", description: "Kontinuierliche Performance-Audits, Tracking und Iterationen." },
        ]
      : steps;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h2 className={styles.title}>
            {copy.title} <span className="platinum-text">{copy.titleAccent}</span>
          </h2>
          <p className={styles.subtitle}>
            {copy.subtitle}
          </p>
        </div>

        <div className={styles.timeline}>
          {localizedSteps.map((step, index) => (
            <div
              key={step.number}
              className={styles.step}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={styles.numberRow}>
                <span className={styles.number}>{step.number}</span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
