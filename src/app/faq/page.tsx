import type { Metadata } from "next";

import styles from "./faq.module.css";
import LocaleLink from "@/components/I18n/LocaleLink";
import { BUSINESS_PROFILE } from "@/lib/businessProfile";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const isDe = locale === "de";
  const basePath = "/faq";
  const canonical = toLocaleCanonical(basePath, locale);
  const title = isDe ? "Haeufige Fragen" : "Frequently Asked Questions";
  const description = isDe
    ? "Antworten auf die wichtigsten Fragen zu Website-Projekten, Web-Produkten und KI-Integrationen."
    : "Answers to common questions about website projects, web products, and AI integrations.";

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

export default async function FaqPage() {
  const locale = await getRequestLocale();
  const isDe = locale === "de";
  const title = isDe ? "Haeufige Fragen" : "Frequently Asked Questions";
  const subtitle = isDe
    ? "Hier findest du kurze, klare Antworten zu Zusammenarbeit, Projektumfang und Lieferung."
    : "Here you can find clear answers about collaboration, project scope, and delivery.";
  const cta = isDe
    ? "Du hast eine konkrete Frage zu deinem Projekt? Schreib ueber die"
    : "Have a specific question about your project? Reach out via the";
  const contactLink = isDe ? "Kontaktseite" : "contact page";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BUSINESS_PROFILE.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <section className={styles.faqList} aria-label={title}>
          {BUSINESS_PROFILE.faq.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </section>

        <p className={styles.cta}>
          {cta} <LocaleLink href="/contact">{contactLink}</LocaleLink>.
        </p>
      </div>
    </main>
  );
}
