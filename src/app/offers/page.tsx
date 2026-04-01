import type { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import OffersPageClient from "./OffersPageClient";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/offers", locale);
  const isDe = locale === "de";
  const title = isDe ? "Angebote für Startups & lokale Unternehmen" : "Offers for Startups & Local Businesses";
  const description = isDe
    ? "Limitierte Aktionsangebote für Websites, MVPs und KI-Automationen mit klarem Scope und schneller Umsetzung."
    : "Limited-time offers for websites, MVPs, and AI automation setups with clear scope and fast delivery.";

  return {
    title,
    description,
    keywords: [
      "startup website offer",
      "business website package",
      "MVP development offer",
      "AI automation package",
      "web design promotion Germany",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/offers"),
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

export default async function OffersPage() {
  const locale = await getRequestLocale();
  const isDe = locale === "de";

  const faqItems = isDe
    ? [
        {
          question: "Für wen sind diese Angebote gedacht?",
          answer: "Für Startups, lokale Unternehmen und wachsende Marken mit hohem Qualitätsanspruch und klarer Launch-Absicht.",
        },
        {
          question: "Wie schnell kann geliefert werden?",
          answer: "Je nach Paket meist innerhalb weniger Tage bis mehrerer Wochen, abhängig vom konkreten Scope.",
        },
        {
          question: "Kann ich individuelle Leistungen anfragen?",
          answer: "Ja. Die Angebote sind Einstiegspunkte und können sauber auf deinen Scope erweitert werden.",
        },
      ]
    : [
        {
          question: "Who are these offers for?",
          answer: "They are designed for startups, local businesses, and growing brands that need quality execution without heavy process overhead.",
        },
        {
          question: "How fast can delivery happen?",
          answer: "Depending on the package, delivery can happen within days to a few weeks based on real scope.",
        },
        {
          question: "Can I request custom work?",
          answer: "Yes. These offers are entry points and can expand into a tailored proposal if your project needs more depth.",
        },
      ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <OffersPageClient locale={locale} />
    </>
  );
}
