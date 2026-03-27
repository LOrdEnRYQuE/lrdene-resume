import type { Metadata } from "next";
import { headers } from "next/headers";

import styles from "../legal.module.css";
import { LOCALE_HEADER_NAME, type Locale, isLocale } from "@/lib/i18n/config";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED, LEGAL_PROCESSORS } from "@/lib/legal/legalInfo";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale: Locale = isLocale(localeHeader) ? localeHeader : "en";
  const basePath = "/privacy";
  return {
    title: "Privacy Policy",
    description: "Privacy policy for LOrdEnRYQuE.",
    alternates: {
      canonical: toLocaleCanonical(basePath, locale),
      languages: getLanguageAlternates(basePath),
    },
  };
}

export default async function PrivacyPage() {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale = isLocale(localeHeader) ? localeHeader : "en";
  const isDe = locale === "de";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{isDe ? "Datenschutzerklärung" : "Privacy Policy"}</h1>
        <p className={styles.subtitle}>
          {isDe ? `Stand: ${LEGAL_LAST_UPDATED}` : `Last updated: ${LEGAL_LAST_UPDATED}`}
        </p>

        <section className={styles.section}>
          <h2>{isDe ? "1. Verantwortliche Stelle" : "1. Data Controller"}</h2>
          <p>{LEGAL_ENTITY.brand}</p>
          <p>{LEGAL_ENTITY.owner}</p>
          <p>{LEGAL_ENTITY.street}, {LEGAL_ENTITY.postalCode} {LEGAL_ENTITY.city}, {LEGAL_ENTITY.country}</p>
          <p>Email: {LEGAL_ENTITY.email}</p>
          <p>Phone: {LEGAL_ENTITY.phone}</p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "2. Welche Daten verarbeitet werden" : "2. What Data We Process"}</h2>
          <ul>
            <li>{isDe ? "Kontaktformulardaten (Name, E-Mail, Projektangaben, Nachricht)" : "Contact form data (name, email, project details, message)"}</li>
            <li>{isDe ? "Technische Zugriffsdaten (IP, Browser, Gerät, Seitenaufrufe)" : "Technical access data (IP, browser, device, page views)"}</li>
            <li>{isDe ? "Freiwillige Tracking- und Kampagnendaten (UTM, Events)" : "Voluntary analytics and campaign data (UTM, events)"}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "3. Zwecke und Rechtsgrundlagen (Art. 6 DSGVO)" : "3. Purposes and Legal Bases (Art. 6 GDPR)"}</h2>
          <p>
            {isDe
              ? "Die Verarbeitung erfolgt zur Bearbeitung von Anfragen, zur Vertragserfüllung, zur Sicherheit sowie zur Optimierung der Website."
              : "Processing is performed to handle requests, fulfill contracts, ensure security, and improve the website."}
          </p>
          <ul>
            <li>{isDe ? "Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)" : "Consent (Art. 6(1)(a) GDPR)"}</li>
            <li>{isDe ? "Vertrag und vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO)" : "Contract and pre-contractual measures (Art. 6(1)(b) GDPR)"}</li>
            <li>{isDe ? "Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO)" : "Legal obligation (Art. 6(1)(c) GDPR)"}</li>
            <li>{isDe ? "Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)" : "Legitimate interests (Art. 6(1)(f) GDPR)"}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "4. Hosting, Sicherheits- und Logdaten" : "4. Hosting, Security, and Log Data"}</h2>
          <p>
            {isDe
              ? "Beim Zugriff auf die Website werden aus technischen und sicherheitsrelevanten Gründen Logdaten verarbeitet."
              : "When accessing this website, log data is processed for technical and security reasons."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "5. Auftragsverarbeiter" : "5. Data Processors"}</h2>
          <ul>
            {LEGAL_PROCESSORS.map((p) => (
              <li key={p.name}>
                <strong>{p.name}:</strong> {p.purpose}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "6. Speicherdauer" : "6. Retention"}</h2>
          <p>
            {isDe
              ? "Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck oder gesetzliche Pflichten erforderlich ist."
              : "Data is retained only as long as needed for the purpose or legal obligations."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "7. Deine Rechte" : "7. Your Rights"}</h2>
          <p>
            {isDe
              ? "Du hast Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch."
              : "You have rights to access, rectify, erase, restrict processing, data portability, and object."}
          </p>
          <p>
            {isDe
              ? "Zusätzlich besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde."
              : "You also have the right to lodge a complaint with a data protection supervisory authority."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isDe ? "8. Kontakt zu Datenschutzanfragen" : "8. Contact for Privacy Requests"}</h2>
          <p>{LEGAL_ENTITY.email}</p>
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
