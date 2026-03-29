import type { Metadata } from "next";
import QRSolutionsPage from "@/components/QRSolutions/QRSolutionsPage";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/qr-solutions", locale);
  const isDe = locale === "de";
  const title = isDe ? "QR- & NFC-Lösungen für Business-Wachstum" : "QR & NFC Solutions for Business Growth";
  const description = isDe
    ? "Setze dynamische QR- und NFC-Systeme für Lead-Erfassung, digitale Visitenkarten, Kampagnen-Tracking und messbare Conversions ein."
    : "Deploy dynamic QR and NFC systems for lead capture, digital business cards, campaign tracking, and measurable conversions.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "QR code business solutions",
      "digital business card",
      "NFC business card",
      "lead capture QR",
      "conversion tracking QR campaigns",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/qr-solutions"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/uTraLink-icon.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/uTraLink-icon.png"],
    },
  };
}

export default function Page() {
  return <QRSolutionsPage />;
}
