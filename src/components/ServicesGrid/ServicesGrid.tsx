import React from "react";
import styles from "./ServicesGrid.module.css";
import {
  Code2,
  BrainCircuit,
  LayoutDashboard
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const services = [
  {
    title: "Websites",
    description: "Fast, premium business websites designed to build trust, explain your offer clearly, and turn visitors into qualified inquiries.",
    icon: <Code2 size={26} />,
  },
  {
    title: "Web Products",
    description: "Client portals, internal tools, booking flows, and custom web platforms built around real business processes and growth goals.",
    icon: <LayoutDashboard size={26} />,
  },
  {
    title: "AI Integration",
    description: "Practical AI features and workflow automation added where they improve service quality, speed, and operational efficiency.",
    icon: <BrainCircuit size={26} />,
  },
];

type ServicesGridProps = {
  locale: Locale;
};

export const ServicesGrid = ({ locale }: ServicesGridProps) => {
  const copy =
    locale === "de"
      ? {
          eyebrow: "Leistungen",
          title: "Was ich",
          titleAccent: "baue",
          subtitle:
            "Drei klare Leistungsbereiche, damit Website, Produkt und technische Umsetzung als ein fokussiertes System zusammenarbeiten.",
        }
      : {
          eyebrow: "Services",
          title: "What I",
          titleAccent: "build",
          subtitle:
            "Three focused service areas built to support one goal: a stronger digital presence that looks credible and performs in the real world.",
        };

  const localizedServices =
    locale === "de"
      ? services.map((service) => ({
          ...service,
          title:
            service.title === "Websites"
              ? "Websites"
              : service.title === "Web Products"
                ? "Web-Produkte"
                : service.title === "AI Integration"
                  ? "KI Integration"
                  : service.title,
          description:
            service.title === "Websites"
              ? "Performante Business-Websites, die Vertrauen aufbauen, Angebote klar erklären und aus Besuchern echte Anfragen machen."
              : service.title === "Web Products"
                ? "Kundenportale, interne Tools, Buchungsflows und individuelle Plattformen rund um reale Geschäftsprozesse."
                : service.title === "AI Integration"
                  ? "Praxisnahe KI-Funktionen und Automationen dort, wo sie Qualität, Geschwindigkeit und Effizienz wirklich verbessern."
                  : service.description,
        }))
      : services;

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

        <div className={styles.grid}>
          {localizedServices.map((service, index) => (
            <div
              key={service.title}
              className={styles.card}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className={styles.iconBox}>
                {service.icon}
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
