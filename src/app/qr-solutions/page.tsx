import type { Metadata } from "next";
import QRSolutionsPage from "@/components/QRSolutions/QRSolutionsPage";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/qr-solutions", locale);

  return {
    title: "QR & NFC Solutions for Business Growth",
    description:
      "Deploy dynamic QR and NFC systems for lead capture, digital business cards, campaign tracking, and measurable conversions.",
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
      title: "QR & NFC Solutions for Business Growth | LOrdEnRYQuE",
      description:
        "Deploy dynamic QR and NFC systems for lead capture, digital business cards, campaign tracking, and measurable conversions.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "QR & NFC Solutions for Business Growth | LOrdEnRYQuE",
      description:
        "Deploy dynamic QR and NFC systems for lead capture, digital business cards, campaign tracking, and measurable conversions.",
      images: ["/assets/LOGO.png"],
    },
  };
}

export default function Page() {
  return <QRSolutionsPage />;
}
