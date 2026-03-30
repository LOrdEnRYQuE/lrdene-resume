import React from "react";
import styles from "./Hero.module.css";
import { ArrowRight, Code, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type HeroStat = {
  label: string;
  value: string;
  icon: string;
};

export type HeroData = {
  headline: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: HeroStat[];
};

type HeroProps = {
  locale: Locale;
  content?: Partial<HeroData> | null;
};

export const Hero = ({ locale, content }: HeroProps) => {
  const LEGACY_SUBTITLE_DE =
    "Ich bin Attila Lazar, Gründer von LOrdEnRYQuE — ich baue Websites, Web-Apps, KI-Workflows und interaktive MVPs, die Kunden direkt testen können.";
  const LEGACY_SUBTITLE_EN =
    "I'm Attila Lazar, founder of LOrdEnRYQuE — building websites, web apps, AI workflows, and interactive business MVPs that clients can actually test.";
  const LEGACY_SUBTITLE_EN_ALT =
    "I'm LOrdEnRYQuE — building websites, web apps, AI workflows, and interactive business MVPs that clients can test immediately.";
  const UPDATED_SUBTITLE_DE =
    "Ich bin LOrdEnRYQuE — ich entwickle Websites, Web-Apps, KI-Workflows und interaktive Business-MVPs, die Kunden direkt testen können.";
  const UPDATED_SUBTITLE_EN =
    "I'm Attila Lazar, founder of LOrdEnRYQuE | Advanced Digital Solution — building websites, web apps, AI workflows, and interactive business MVPs that clients can test immediately.";

  const data = React.useMemo<HeroData>(() => {
    if (content?.headline && content?.subtitle && content?.ctaPrimary && content?.ctaSecondary && Array.isArray(content?.stats)) {
      return {
        headline: content.headline,
        subtitle: content.subtitle,
        ctaPrimary: content.ctaPrimary,
        ctaSecondary: content.ctaSecondary,
        stats: content.stats as HeroStat[],
      };
    }
    if (locale === "de") {
      return {
        headline: "Premium Websites, KI-Produkte und Designsysteme.",
        subtitle: UPDATED_SUBTITLE_DE,
        ctaPrimary: "Demos Ansehen",
        ctaSecondary: "Projekte Ansehen",
        stats: [
          { label: "Verfügbar", value: "Für neue Projekte", icon: "Zap" },
          { label: "14+ Jahre", value: "IT Erfahrung", icon: "Code" },
        ],
      };
    }
    return {
      headline: "Premium Websites, AI Products, and Design Systems.",
      subtitle: UPDATED_SUBTITLE_EN,
      ctaPrimary: "View Demos",
      ctaSecondary: "View Projects",
      stats: [
        { label: "Available", value: "For new builds", icon: "Zap" },
        { label: "14+ Years", value: "IT Experience", icon: "Code" }
      ]
    };
  }, [content, locale]);

  const resolvedSubtitle =
    data.subtitle === LEGACY_SUBTITLE_DE
        ? UPDATED_SUBTITLE_DE
        : data.subtitle === LEGACY_SUBTITLE_EN || data.subtitle === LEGACY_SUBTITLE_EN_ALT
          ? UPDATED_SUBTITLE_EN
          : data.subtitle;

  const ICON_MAP: Record<string, React.ReactNode> = {
    Zap: <Zap size={20} className="gold-text" />,
    Code: <Code size={20} className="gold-text" />
  };

  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.grid} />

      {/* ── Rotating Globe Background ──────────────────────── */}
      <div className={styles.globeWrap} aria-hidden="true">
        <div className={styles.globe}>
          {/* Equator + meridians */}
          <div className={`${styles.orbit} ${styles.orbit1}`} />
          <div className={`${styles.orbit} ${styles.orbit2}`} />
          <div className={`${styles.orbit} ${styles.orbit3}`} />
          {/* Latitude lines */}
          <div className={`${styles.lat} ${styles.lat1}`} />
          <div className={`${styles.lat} ${styles.lat2}`} />
          <div className={`${styles.lat} ${styles.lat3}`} />
          <div className={`${styles.lat} ${styles.lat4}`} />
          {/* Glow core */}
          <div className={styles.globeCore} />
          {/* Outer shimmer ring */}
          <div className={styles.globeRing} />
        </div>
        {/* Floating particles around the globe */}
        <div className={`${styles.particle} ${styles.p1}`} />
        <div className={`${styles.particle} ${styles.p2}`} />
        <div className={`${styles.particle} ${styles.p3}`} />
        <div className={`${styles.particle} ${styles.p4}`} />
        <div className={`${styles.particle} ${styles.p5}`} />
      </div>

      <div className={`${styles.content} container`}>
        <div className={styles.heroIntro}>
          <h1 className={styles.heroHeadline}>
            {(() => {
              const parts = data.headline.split(",");
              return (
                <>
                  {parts[0]?.trim()}
                  {parts[1] ? (
                    <>
                      ,<br />
                      <span className="gold-text">{parts[1].trim()}</span>
                    </>
                  ) : null}
                  {parts[2] ? (
                    <>
                      ,<br />
                      {parts[2].trim()}
                    </>
                  ) : null}
                </>
              );
            })()}
          </h1>
          <p className={styles.subheadline}>
            {resolvedSubtitle}
          </p>


          <div className={styles.ctaRow}>
            <Link href="/demos" className={styles.primaryCta}>
              {data.ctaPrimary} <ArrowRight size={18} style={{ marginLeft: "8px", display: "inline" }} />
            </Link>
            <Link href="/projects" className={styles.heroSecondaryAction}>
              {data.ctaSecondary}
            </Link>
          </div>

        </div>

        {/* ── Portrait ──────────────────────────────────────── */}
        <div className={styles.portraitWrapper}>
          {/* Outer glow halo */}
          <div className={styles.portraitHalo} />
          {/* Gradient border frame */}
          <div className={styles.portraitBorderFrame}>
            <div className={styles.portrait}>
              <Image
                src="/assets/Profile.webp"
                alt="Attila Lazar - LOrdEnRYQuE"
                fill
                className={styles.profileImage}
                priority
                quality={70}
                sizes="(max-width: 768px) 88vw, (max-width: 1200px) 44vw, 480px"
              />
              {/* Bottom vignette for depth */}
              <div className={styles.portraitVignette} />
            </div>
          </div>

          {data.stats.map((stat: any, idx: number) => (
            <div
              key={idx}
              className={`${styles.statCard} ${idx === 0 ? styles.stat1 : styles.stat2}`}
            >
              {ICON_MAP[stat.icon] || <Zap size={20} className="gold-text" />}
              <div style={{ marginTop: "8px" }}>
                <strong>{stat.label}</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{stat.value}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};
