import type { Metadata } from "next";
import Link from "next/link";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import styles from "./Partners.module.css";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/partners", locale);
  const isDe = locale === "de";
  const title = isDe ? "Partner- & Empfehlungsprogramm" : "Partner & Referral Program";
  const description = isDe
    ? "Kooperations- und Empfehlungsmodelle für Agenturen, Berater und Produktteams mit transparenter Zusammenarbeit."
    : "Collaboration and referral models for agencies, consultants, and product teams with clear delivery ownership.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "partner program",
      "referral partnership",
      "white label development partner",
      "agency collaboration",
      "technical delivery partner",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/partners"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/LOGO.png"],
    },
  };
}

export default async function PartnersPage() {
  const locale = await getRequestLocale();
  const isDe = locale === "de";

  const copy = isDe
    ? {
        badge: "Wachstum durch Kooperation",
        title: "Partner- und Empfehlungsprogramm",
        subtitle:
          "Für Agenturen, Berater und Teams, die zuverlässige Umsetzung in KI, Next.js und Produktentwicklung brauchen.",
        modelsTitle: "Zusammenarbeitsmodelle",
        referralTitle: "Empfehlungspartner",
        referralBody:
          "Du stellst den Kontakt her, ich übernehme Discovery, Angebot und Umsetzung. Ideal für Berater, Freelancer und Creator mit passender Zielgruppe.",
        referralPointA: "Schneller Qualifizierungs-Call mit deinem Lead",
        referralPointB: "Klare Scope-Definition und transparente Übergabe",
        referralPointC: "Faire Beteiligung pro abgeschlossenem Projekt",
        executionTitle: "Umsetzungspartner",
        executionBody:
          "Du führst die Kundenbeziehung, ich liefere als technischer Partner im Hintergrund oder im Co-Branding-Setup mit klaren Zuständigkeiten.",
        executionPointA: "White-Label oder Co-Branding-Umsetzung möglich",
        executionPointB: "Strukturierte Sprints, regelmäßige Status-Updates",
        executionPointC: "Verlässlich bei Frontend, Backend und KI-Integrationen",
        fitTitle: "Wann es passt",
        fitA: "Du hast wiederkehrende Anfragen für Web, Automatisierungen oder KI-Features.",
        fitB: "Du brauchst einen Partner, der sauber dokumentiert und termintreu liefert.",
        fitC: "Du willst deine Kapazität erweitern, ohne ein großes Inhouse-Team aufzubauen.",
        ctaTitle: "Lass uns den passenden Modus festlegen",
        ctaBody: "15 Minuten reichen, um Empfehlungs- oder Umsetzungsmodell sauber festzulegen.",
        ctaPrimary: "Partner-Call anfragen",
        ctaSecondary: "Kontaktseite öffnen",
      }
    : {
        badge: "Growth Through Collaboration",
        title: "Partner and Referral Program",
        subtitle:
          "Built for agencies, consultants, and teams that need dependable AI, Next.js, and product delivery support.",
        modelsTitle: "Engagement Models",
        referralTitle: "Referral Partner",
        referralBody:
          "You introduce the lead, I handle discovery, proposal, and delivery. Best for consultants, freelancers, and creators with relevant client access.",
        referralPointA: "Fast qualification call with your lead",
        referralPointB: "Clear scoping and transparent handover",
        referralPointC: "Fair referral share per closed project",
        executionTitle: "Delivery Partner",
        executionBody:
          "You keep client ownership, I deliver as your technical execution partner in white-label or co-branded setup.",
        executionPointA: "White-label and co-branded delivery options",
        executionPointB: "Structured sprint rhythm with regular updates",
        executionPointC: "Reliable frontend, backend, and AI implementation",
        fitTitle: "When This Is a Fit",
        fitA: "You regularly get requests for web builds, automation, or AI features.",
        fitB: "You need a partner who documents clearly and ships on time.",
        fitC: "You want to scale delivery without building a large in-house team.",
        ctaTitle: "Pick the right collaboration mode",
        ctaBody: "A 15-minute call is enough to define referral or delivery structure.",
        ctaPrimary: "Request a Partner Call",
        ctaSecondary: "Open Contact Page",
      };

  return (
    <main className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <span className={styles.badge}>{copy.badge}</span>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </section>

      <section className={`container ${styles.models}`}>
        <h2 className={styles.sectionTitle}>{copy.modelsTitle}</h2>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>{copy.referralTitle}</h3>
            <p>{copy.referralBody}</p>
            <ul>
              <li>{copy.referralPointA}</li>
              <li>{copy.referralPointB}</li>
              <li>{copy.referralPointC}</li>
            </ul>
          </article>
          <article className={styles.card}>
            <h3>{copy.executionTitle}</h3>
            <p>{copy.executionBody}</p>
            <ul>
              <li>{copy.executionPointA}</li>
              <li>{copy.executionPointB}</li>
              <li>{copy.executionPointC}</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={`container ${styles.fit}`}>
        <h2 className={styles.sectionTitle}>{copy.fitTitle}</h2>
        <ul className={styles.fitList}>
          <li>{copy.fitA}</li>
          <li>{copy.fitB}</li>
          <li>{copy.fitC}</li>
        </ul>
      </section>

      <section className={`container ${styles.cta}`}>
        <h2>{copy.ctaTitle}</h2>
        <p>{copy.ctaBody}</p>
        <div className={styles.ctaActions}>
          <Link href="/contact?topic=partners" className={styles.primaryCta}>
            {copy.ctaPrimary}
          </Link>
          <Link href="/contact" className={styles.secondaryCta}>
            {copy.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}
