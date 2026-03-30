import React from "react";
import styles from "./Promotions.module.css";
import { ArrowRight, BadgePercent } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";

type PromotionsContent = {
  eyebrow?: string;
  titleA?: string;
  titleB?: string;
  subtitle?: string;
  note?: string;
  cta?: string;
  tiers?: Array<{ off?: string; stage?: string }>;
};

type PromotionsProps = {
  locale: Locale;
  content?: PromotionsContent | null;
};

export const Promotions = ({ locale, content }: PromotionsProps) => {
  const de = locale === "de";
  const defaults = de
    ? {
        eyebrow: "Startup-Angebote",
        titleA: "Startup-Angebote von",
        titleB: "10% bis 50% OFF",
        subtitle:
          "Für Startup-Unternehmen biete ich projektabhängige Rabatte. Der Einstieg startet bei 10%, mit bis zu 50% OFF für starke Fit-Cases.",
        note: "Die finale Rabattstufe hängt von Scope, Timeline und strategischem Fit ab.",
        cta: "Startup-Angebot Anfragen",
      }
    : {
        eyebrow: "Startup Promotions",
        titleA: "Startup offers from",
        titleB: "10% to 50% OFF",
        subtitle:
          "For startup businesses, I offer project-based discounts. Entry starts at 10%, with up to 50% OFF for high-fit opportunities.",
        note: "Final discount level depends on project scope, timeline, and strategic fit.",
        cta: "Claim Startup Offer",
      };
  const data = (content ?? defaults) as PromotionsContent;
  const tiers =
    Array.isArray(data.tiers) && data.tiers.length > 0
      ? data.tiers
          .filter((tier) => typeof tier?.off === "string" && typeof tier?.stage === "string")
          .map((tier) => ({ off: String(tier.off), stage: String(tier.stage) }))
      : [
          { off: "10%", stage: de ? "Frühe Idee" : "Early-stage idea" },
          { off: "20%", stage: de ? "MVP Planung" : "MVP planning" },
          { off: "30%", stage: de ? "Erste Traktion" : "Initial traction" },
          { off: "40%", stage: de ? "Product-Market-Validierung" : "Product-market validation" },
          { off: "50%", stage: de ? "High-Potential Startup-Fit" : "High-potential startup fit" },
        ];
  const offLabel = de ? "Rabatt" : "OFF";

  return (
    <section className={styles.section} id="promotions">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <BadgePercent size={13} />
            {data.eyebrow || defaults.eyebrow}
          </span>
          <h2 className={styles.title}>
            {data.titleA || defaults.titleA} <span className="platinum-text">{data.titleB || defaults.titleB}</span>
          </h2>
          <p className={styles.subtitle}>{data.subtitle || defaults.subtitle}</p>
        </div>

        <div className={styles.tierGrid}>
          {tiers.map((tier) => (
            <article key={tier.off} className={styles.tierCard}>
              <strong>{tier.off} {offLabel}</strong>
              <span>{tier.stage}</span>
            </article>
          ))}
        </div>

        <div className={styles.footer}>
          <p>{data.note || defaults.note}</p>
          <Link href="/contact" className={styles.ctaBtn}>
            {data.cta || defaults.cta} <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};
