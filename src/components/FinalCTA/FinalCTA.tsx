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
          titleLine1: "Lass uns etwas bauen, dem deine Kunden",
          titleTrust: "vertrauen",
          titleLine2: "und das deine Konkurrenz",
          titleHate: "hassen",
          subtitle:
            "Von KI-Plattformen bis zu ausgereiften SaaS-Produkten: Ich bringe den kompletten Stack mit.",
          ctaPrimary: "Projekt Starten",
          ctaSecondary: "Leistungen Ansehen",
        }
      : {
          eyebrow: "Ready to build?",
          titleLine1: "Let's build something your clients can",
          titleTrust: "trust",
          titleLine2: "and your competitors will",
          titleHate: "hate",
          subtitle:
            "From AI-powered platforms to polished SaaS products — I bring the full stack to the table. Let's make it happen.",
          ctaPrimary: "Start a Project",
          ctaSecondary: "View Services",
        };

  const localePrefix = locale === "de" ? "/de" : "/en";

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
              href={`${localePrefix}/contact`}
              className={styles.ctaBtn}
              data-track-event="click_cta"
              data-track-label="Final CTA: Start a Project"
            >
              {copy.ctaPrimary} <ArrowRight size={18} />
            </Link>
            <Link
              href={`${localePrefix}/services`}
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
