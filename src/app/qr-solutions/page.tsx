import type { Metadata } from "next";
import QRSolutionsPage from "@/components/QRSolutions/QRSolutionsPage";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/qr-solutions", locale);

  return {
    title: "QR Code Solutions for Business",
    description:
      "Dynamic QR and NFC solutions for lead capture, virtual business cards, campaigns, and measurable conversion growth.",
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
      title: "QR Code Solutions for Business | LOrdEnRYQuE",
      description:
        "Dynamic QR and NFC solutions for lead capture, virtual business cards, campaigns, and measurable conversion growth.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "QR Code Solutions for Business | LOrdEnRYQuE",
      description:
        "Dynamic QR and NFC solutions for lead capture, virtual business cards, campaigns, and measurable conversion growth.",
    },
  };
}

export default function Page() {
  return <QRSolutionsPage />;
}
