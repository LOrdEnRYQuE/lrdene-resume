import type { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

type Props = {
  children: React.ReactNode;
};

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/demos", locale);
  const isDe = locale === "de";
  const title = isDe ? "Interaktive Demos" : "Interactive Demos";
  const description = isDe
    ? "Live-Demo-Galerie für KI-Produkte, SaaS-Oberflächen, E-Commerce und conversion-orientierte digitale Erlebnisse."
    : "Live demo gallery for AI products, SaaS interfaces, e-commerce, and conversion-focused digital experiences.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "interactive web demos",
      "AI SaaS demos",
      "Next.js demo gallery",
      "portfolio demo projects",
      "digital product prototypes",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/demos"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/ai-agents-hero.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/ai-agents-hero.png"],
    },
  };
}

export default function DemosLayout({ children }: Props) {
  return children;
}
