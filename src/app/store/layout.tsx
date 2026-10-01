import type { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

type Props = {
  children: React.ReactNode;
};

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/store", locale);
  const isDe = locale === "de";

  const title = isDe
    ? "Digitale Content Kits für lokale Unternehmen"
    : "Digital Content Kits for Local Businesses";
  const description = isDe
    ? "Entdecke LOrdEnRYQuE Digital Content Kits für Reinigungsfirmen, Salons & Barbershops und Fahrzeugaufbereitung. Verkauf und Downloads laufen zentral über Shopify."
    : "Discover LOrdEnRYQuE Digital content kits for cleaning companies, salons and barbershops, and vehicle detailing. Commerce and downloads are managed through Shopify.";

  return {
    title,
    description,
    keywords: isDe
      ? [
          "Content Kits lokale Unternehmen",
          "Social Media Vorlagen Unternehmen",
          "Content Kit Reinigungsfirma",
          "Content Kit Barbershop",
          "Content Kit Fahrzeugaufbereitung",
        ]
      : [
          "content kits local businesses",
          "social media content templates",
          "cleaning company content kit",
          "barbershop content kit",
          "vehicle detailing content kit",
        ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/store"),
    },
    robots: {
      index: true,
      follow: true,
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

export default function StoreLayout({ children }: Props) {
  return children;
}
