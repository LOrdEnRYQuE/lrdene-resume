import React from "react";
import styles from "./ServicesGrid.module.css";
import {
  Code2,
  Palette,
  BrainCircuit,
  Layers,
  Trophy,
  LayoutDashboard
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const services = [
  {
    title: "Web Development",
    description: "High-performance, scalable web applications built with modern frameworks like Next.js and Convex.",
    icon: <Code2 size={26} />,
  },
  {
    title: "AI Integration",
    description: "Embedding intelligent workflows and LLM-powered features into your existing or new products.",
    icon: <BrainCircuit size={26} />,
  },
  {
    title: "Graphic Design",
    description: "Cinematic visual identities and premium branding systems that command attention.",
    icon: <Palette size={26} />,
  },
  {
    title: "UI/UX Architecture",
    description: "User-centric design systems focused on conversion, accessibility, and high-end aesthetics.",
    icon: <Layers size={26} />,
  },
  {
    title: "Branding Systems",
    description: "Complete identity design from logos to full brand guidelines for modern businesses.",
    icon: <Trophy size={26} />,
  },
  {
    title: "Dashboard & Admin",
    description: "Powerful custom control centers for managing your business data and operations.",
    icon: <LayoutDashboard size={26} />,
  },
];

type ServicesGridProps = {
  locale: Locale;
};

export const ServicesGrid = ({ locale }: ServicesGridProps) => {
  const copy =
    locale === "de"
      ? {
          eyebrow: "Was ich mache",
          title: "Premium",
          titleAccent: "Leistungen",
          subtitle:
            "Eine Mischung aus Engineering-Präzision und kreativem Anspruch, für Unternehmen mit höchsten Standards.",
        }
      : {
          eyebrow: "What I do",
          title: "Premium",
          titleAccent: "Services",
          subtitle:
            "A unique blend of engineering precision and artistic vision, tailored for businesses that demand the highest standards.",
        };

  const localizedServices =
    locale === "de"
      ? services.map((service) => ({
          ...service,
          title:
            service.title === "Web Development"
              ? "Webentwicklung"
              : service.title === "AI Integration"
                ? "KI Integration"
                : service.title === "Graphic Design"
                  ? "Grafikdesign"
                  : service.title === "UI/UX Architecture"
                    ? "UI/UX Architektur"
                    : service.title === "Branding Systems"
                      ? "Branding Systeme"
                      : service.title === "Dashboard & Admin"
                        ? "Dashboard & Admin"
                        : service.title,
          description:
            service.title === "Web Development"
              ? "High-Performance Web-Apps mit modernen Frameworks wie Next.js und Convex."
              : service.title === "AI Integration"
                ? "Intelligente Workflows und LLM-Features in bestehende oder neue Produkte integrieren."
                : service.title === "Graphic Design"
                  ? "Cinematic Visual Identities und Premium-Branding-Systeme mit starker Präsenz."
                  : service.title === "UI/UX Architecture"
                    ? "Nutzerzentrierte Designsysteme mit Fokus auf Conversion, Accessibility und Ästhetik."
                    : service.title === "Branding Systems"
                      ? "Komplettes Identity Design von Logo bis zu klaren Brand Guidelines."
                      : service.title === "Dashboard & Admin"
                        ? "Leistungsstarke Control Center zur Verwaltung von Daten und Prozessen."
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
