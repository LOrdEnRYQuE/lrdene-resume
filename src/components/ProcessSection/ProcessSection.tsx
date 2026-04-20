import React from "react";
import styles from "./ProcessSection.module.css";
import { Search, LayoutTemplate, Code2, Rocket, BarChart3 } from "lucide-react";
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
    title: "Plan",
    description: "Define page structure, conversion path, and the right feature scope before build starts.",
    icon: <LayoutTemplate size={18} />,
  },
  {
    number: "03",
    title: "Build",
    description: "Build a fast, reliable website or web product with clean implementation and strong UX fundamentals.",
    icon: <Code2 size={18} />,
  },
  {
    number: "04",
    title: "Launch",
    description: "Deploy with clear metadata, polished content, and the technical foundations needed for search and conversion.",
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
            "Ein klarer Ablauf, der Scope reduziert, saubere Entscheidungen möglich macht und zuverlässig zu einem starken Ergebnis führt.",
        }
      : {
          eyebrow: "How it works",
          title: "The",
          titleAccent: "Process",
          subtitle:
            "A clear workflow built to reduce noise, make better decisions early, and ship a stronger final product.",
        };

  const localizedSteps =
    locale === "de"
      ? [
          { ...steps[0], title: "Verstehen", description: "Tiefer Einblick in Ziele, Zielgruppe und Herausforderungen." },
          { ...steps[1], title: "Planen", description: "Seitenstruktur, Conversion-Pfad und sinnvoller Feature-Scope werden vor dem Build festgelegt." },
          { ...steps[2], title: "Umsetzen", description: "Sauberer, performanter Code für Websites und Web-Produkte mit stabiler Basis." },
          { ...steps[3], title: "Launchen", description: "Deployment mit klaren Metadaten, sauberen Inhalten und solider technischer Grundlage." },
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
