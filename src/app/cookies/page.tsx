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
  const basePath = "/cookies";
  return {
    title: "Cookie Policy",
    description: "Cookie policy and consent controls for LOrdEnRYQuE.",
    alternates: {
      canonical: toLocaleCanonical(basePath, locale),
      languages: getLanguageAlternates(basePath),
    },
  };
}

export default async function CookiesPage() {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale = isLocale(localeHeader) ? localeHeader : "en";
  const isDe = locale === "de";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{isDe ? "Cookie-Richtlinie" : "Cookie Policy"}</h1>
        <p className={styles.subtitle}>
          {isDe ? `Stand: ${LEGAL_LAST_UPDATED}` : `Last updated: ${LEGAL_LAST_UPDATED}`}
        </p>

        <section className={styles.section}>
          <h2>{isDe ? "1. Verantwortliche Stelle" : "1. Controller"}</h2>
          <p>{LEGAL_ENTITY.brand}</p>
          <p>{LEGAL_ENTITY.email}</p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "2. Verwendete Cookie-Kategorien" : "2. Cookie Categories Used"}</h2>
          <ul>
            <li>
              <strong>{isDe ? "Notwendig" : "Essential"}:</strong>{" "}
              {isDe
                ? "Für Sicherheit, Session-Handling und technische Kernfunktionen."
                : "Required for security, session handling, and core technical functionality."}
            </li>
            <li>
              <strong>{isDe ? "Analyse (optional)" : "Analytics (optional)"}:</strong>{" "}
              {isDe
                ? "Nur nach Einwilligung, zur Verbesserung von Performance und Nutzerfluss."
                : "Only after consent, used to improve performance and user flows."}
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "3. Einwilligung und Widerruf" : "3. Consent and Withdrawal"}</h2>
          <p>
            {isDe
              ? "Du kannst die Auswahl jederzeit über den Button „Cookie Einstellungen“ unten links ändern."
              : "You can change your choice at any time via the “Cookie Settings” button at the bottom left."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "4. Speicherdauer" : "4. Retention"}</h2>
          <p>
            {isDe
              ? "Die Consent-Entscheidung wird lokal gespeichert, bis sie geändert oder gelöscht wird."
              : "The consent decision is stored locally until changed or deleted."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "5. Kontakt" : "5. Contact"}</h2>
          <p>{LEGAL_ENTITY.email}</p>
        </section>
      </div>
    </main>
  );
}
