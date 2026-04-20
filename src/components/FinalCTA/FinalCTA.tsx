import React from "react";
import styles from "./FinalCTA.module.css";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type FinalCTAProps = {
  locale: Locale;
};

export const FinalCTA = ({ locale }: FinalCTAProps) => {
  const copy =
    locale === "de"
      ? {
          eyebrow: "Bereit zu bauen?",
          titleLine1: "Lass uns eine Website oder ein Web-Produkt bauen,",
          titleTrust: "dem Kunden vertrauen",
          titleLine2: "und das dein Geschäft",
          titleHate: "klarer macht",
          subtitle:
            "Wenn du eine professionelle Website, ein Kundenportal oder ein individuelles Web-Tool brauchst, lass uns den richtigen Scope sauber festlegen.",
          ctaPrimary: "Projekt Starten",
          ctaSecondary: "Leistungen Ansehen",
        }
      : {
          eyebrow: "Ready to build?",
          titleLine1: "Let’s build a website or web product your clients can",
          titleTrust: "trust",
          titleLine2: "and your business can",
          titleHate: "grow with",
          subtitle:
            "If you need a professional website, client portal, or custom business tool, we can define the right scope and build it properly.",
          ctaPrimary: "Start a Project",
          ctaSecondary: "View Services",
        };

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.card}>
          <span className={styles.eyebrow}>
            <Sparkles size={12} style={{ display: "inline", marginRight: "6px" }} />
            {copy.eyebrow}
          </span>

          <h2 className={styles.title}>
            {copy.titleLine1} <span className="platinum-text">{copy.titleTrust}</span> <br />
            {copy.titleLine2} <span className="platinum-text">{copy.titleHate}</span>.
          </h2>

          <p className={styles.subtitle}>
            {copy.subtitle}
          </p>

          <div className={styles.btnRow}>
            <Link
              href="/contact"
              className={styles.ctaBtn}
              data-track-event="click_cta"
              data-track-label="Final CTA: Start a Project"
            >
              {copy.ctaPrimary} <ArrowRight size={18} />
            </Link>
            <Link
              href="/services"
              className={styles.ghostBtn}
              data-track-event="click_cta"
              data-track-label="Final CTA: View Services"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
