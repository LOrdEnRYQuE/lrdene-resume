import type { Metadata } from "next";
import { headers } from "next/headers";

import styles from "../legal.module.css";
import { LOCALE_HEADER_NAME, type Locale, isLocale } from "@/lib/i18n/config";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal/legalInfo";
import { BUSINESS_PROFILE } from "@/lib/businessProfile";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale: Locale = isLocale(localeHeader) ? localeHeader : "en";
  const isDe = locale === "de";
  const basePath = "/imprint";
  const title = isDe ? "Impressum" : "Imprint";
  const description = isDe
    ? "Impressum für LOrdEnRYQuE."
    : "Legal notice (Impressum) for LOrdEnRYQuE.";
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

export default async function ImprintPage() {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale = isLocale(localeHeader) ? localeHeader : "en";
  const isDe = locale === "de";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{isDe ? "Impressum" : "Imprint (Legal Notice)"}</h1>
        <p className={styles.subtitle}>
          {isDe ? `Angaben gemäß § 5 TMG · Stand: ${LEGAL_LAST_UPDATED}` : `Information according to § 5 TMG (Germany) · Last updated: ${LEGAL_LAST_UPDATED}`}
        </p>

        <section className={styles.section}>
          <h2>{isDe ? "Diensteanbieter" : "Service Provider"}</h2>
          <p>{LEGAL_ENTITY.brand}</p>
          <p>{LEGAL_ENTITY.owner}</p>
          <p>{LEGAL_ENTITY.businessType}</p>
          <p>{LEGAL_ENTITY.street}, {LEGAL_ENTITY.postalCode} {LEGAL_ENTITY.city}, {LEGAL_ENTITY.country}</p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "Kontakt" : "Contact"}</h2>
          <p>Email: {LEGAL_ENTITY.email}</p>
          <p>Phone: {LEGAL_ENTITY.phone}</p>
          <p>Website: {LEGAL_ENTITY.website}</p>
          <p>
            {isDe ? "Geschäftszeiten" : "Business hours"}:{" "}
            {BUSINESS_PROFILE.hours.days.join(", ")} {BUSINESS_PROFILE.hours.opens} - {BUSINESS_PROFILE.hours.closes} ({BUSINESS_PROFILE.timezone})
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "Leistungen" : "Services"}</h2>
          <p>{BUSINESS_PROFILE.services.join(" · ")}</p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "Umsatzsteuer-ID" : "VAT ID"}</h2>
          <p>{LEGAL_ENTITY.vatId || (isDe ? "Derzeit keine USt-IdNr. hinterlegt." : "No VAT ID published at this time.")}</p>
          <p>{isDe ? LEGAL_ENTITY.taxNoteDe : LEGAL_ENTITY.taxNoteEn}</p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "Verantwortlich für Inhalte" : "Responsible for Content"}</h2>
          <p>Attila Lazar, Anschrift wie oben.</p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "EU-Streitschlichtung" : "EU Dispute Resolution"}</h2>
          <p>
            {isDe
              ? "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/"
              : "The European Commission provides a platform for online dispute resolution: https://ec.europa.eu/consumers/odr/"}
          </p>
        </section>

        <p className={styles.small}>
          {isDe
            ? "Hinweis: Rechtstexte regelmäßig prüfen und bei Bedarf juristisch anpassen lassen."
            : "Note: Review legal text regularly and update with legal counsel when needed."}
        </p>
      </div>
    </main>
  );
}
