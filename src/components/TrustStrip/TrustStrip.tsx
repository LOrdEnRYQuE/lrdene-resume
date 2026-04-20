import React from "react";
import styles from "./TrustStrip.module.css";
import { CheckCircle2, Gauge, ShieldCheck, Workflow } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type TrustStripProps = {
  locale: Locale;
};

const ITEMS = {
  en: [
    {
      icon: <Gauge size={20} />,
      title: "Performance First",
      description: "Built to load fast, feel polished, and support real business use.",
    },
    {
      icon: <Workflow size={20} />,
      title: "Business-Focused Scope",
      description: "Clear structure, practical features, and less noise around the main offer.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Reliable Delivery",
      description: "Clean implementation, structured handoff, and stable long-term ownership.",
    },
    {
      icon: <CheckCircle2 size={20} />,
      title: "Conversion Clarity",
      description: "Pages designed to explain your offer clearly and move visitors to action.",
    },
  ],
  de: [
    {
      icon: <Gauge size={20} />,
      title: "Performance zuerst",
      description: "Schnell, hochwertig und für reale Business-Nutzung gebaut.",
    },
    {
      icon: <Workflow size={20} />,
      title: "Fokussierter Scope",
      description: "Klare Struktur, sinnvolle Features und weniger Ablenkung rund um das Hauptangebot.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Verlässliche Umsetzung",
      description: "Saubere Entwicklung, strukturierte Übergabe und stabile Weiterentwicklung.",
    },
    {
      icon: <CheckCircle2 size={20} />,
      title: "Klare Conversion",
      description: "Seiten, die dein Angebot verständlich machen und Besucher in Anfragen verwandeln.",
    },
  ],
} as const;

export const TrustStrip = ({ locale }: TrustStripProps) => {
  const isDe = locale === "de";
  const items = isDe ? ITEMS.de : ITEMS.en;
  const copy = isDe
    ? {
        eyebrow: "Warum Kunden mich beauftragen",
        title: "Fokus, Qualität und saubere Umsetzung.",
        subtitle:
          "Keine unnötige Komplexität. Nur eine klar strukturierte Website oder ein Web-Produkt, das professionell wirkt und verlässlich arbeitet.",
      }
    : {
        eyebrow: "Why Clients Hire Me",
        title: "Focused execution with premium standards.",
        subtitle:
          "No unnecessary complexity. Just a clearly structured website or web product that looks credible and works reliably.",
      };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.icon}>{item.icon}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
