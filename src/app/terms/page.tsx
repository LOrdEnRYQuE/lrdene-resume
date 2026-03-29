import type { Metadata } from "next";
import { headers } from "next/headers";

import styles from "../legal.module.css";
import { LOCALE_HEADER_NAME, type Locale, isLocale } from "@/lib/i18n/config";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal/legalInfo";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale: Locale = isLocale(localeHeader) ? localeHeader : "en";
  const isDe = locale === "de";
  const basePath = "/terms";
  const title = isDe ? "Nutzungsbedingungen" : "Terms of Service";
  const description = isDe
    ? "Nutzungsbedingungen für LOrdEnRYQuE."
    : "Terms of service for LOrdEnRYQuE.";
  const canonical = toLocaleCanonical(basePath, locale);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(basePath),
    },
    openGraph: {
      title: `${title} | LOrdEnRYQuE`,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | LOrdEnRYQuE`,
      description,
      images: ["/assets/LOGO.png"],
    },
  };
}

export default async function TermsPage() {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale = isLocale(localeHeader) ? localeHeader : "en";
  const isDe = locale === "de";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{isDe ? "Nutzungsbedingungen" : "Terms of Service"}</h1>
        <p className={styles.subtitle}>
          {isDe ? `Stand: ${LEGAL_LAST_UPDATED}` : `Last updated: ${LEGAL_LAST_UPDATED}`}
        </p>

        <section className={styles.section}>
          <h2>{isDe ? "1. Geltungsbereich" : "1. Scope"}</h2>
          <p>
            {isDe
              ? "Diese Bedingungen regeln die Nutzung dieser Website und bereitgestellter digitaler Leistungen."
              : "These terms govern the use of this website and provided digital services."}
          </p>
          <p>
            {isDe
              ? `Anbieterstatus: ${LEGAL_ENTITY.businessType}.`
              : `Provider status: ${LEGAL_ENTITY.businessType}.`}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "2. Leistungen und Vertragsschluss" : "2. Services and Contracting"}</h2>
          <p>
            {isDe
              ? "Leistungsumfang, Zeitplan und Vergütung werden individuell in Angeboten oder Verträgen festgelegt."
              : "Scope, timeline, and pricing are defined individually in proposals or contracts."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "3. Mitwirkungspflichten" : "3. Client Responsibilities"}</h2>
          <p>
            {isDe
              ? "Für eine fristgerechte Leistungserbringung sind notwendige Inhalte, Freigaben und Zugänge rechtzeitig bereitzustellen."
              : "To enable timely delivery, required content, approvals, and access credentials must be provided on time."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "4. Geistiges Eigentum" : "4. Intellectual Property"}</h2>
          <p>
            {isDe
              ? "Alle Inhalte und Systeme bleiben urheberrechtlich geschützt, soweit nicht ausdrücklich übertragen."
              : "All content and systems remain protected by intellectual property rights unless explicitly transferred."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "5. Vergütung und Fälligkeit" : "5. Fees and Due Dates"}</h2>
          <p>
            {isDe
              ? "Vergütungen und Zahlungsziele werden in Angebot oder Vertrag geregelt. Bei Zahlungsverzug können Leistungen ausgesetzt werden."
              : "Fees and payment terms are defined in proposal or contract. In case of delayed payment, services may be paused."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "6. Haftung" : "6. Liability"}</h2>
          <p>
            {isDe
              ? "Eine Haftung besteht im gesetzlichen Rahmen; für externe Inhalte und Drittanbieter besteht keine Gewähr."
              : "Liability applies within legal limits; no warranty is provided for external content or third-party services."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "7. Vertraulichkeit" : "7. Confidentiality"}</h2>
          <p>
            {isDe
              ? "Beide Parteien behandeln nicht öffentliche Projektinformationen vertraulich."
              : "Both parties treat non-public project information as confidential."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "8. Schlussbestimmungen" : "8. Final Provisions"}</h2>
          <p>
            {isDe
              ? "Es gilt deutsches Recht, soweit gesetzlich zulässig."
              : "German law applies where legally permissible."}
          </p>
          <p>
            {isDe
              ? `Anbieter: ${LEGAL_ENTITY.owner}, ${LEGAL_ENTITY.city}`
              : `Provider: ${LEGAL_ENTITY.owner}, ${LEGAL_ENTITY.city}`}
          </p>
        </section>

        <p className={styles.small}>
          {isDe
            ? "Hinweis: Diese Seite ist eine allgemeine Information und keine Rechtsberatung."
            : "Note: This page is general information and not legal advice."}
        </p>
      </div>
    </main>
  );
}
