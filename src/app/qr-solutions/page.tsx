import type { Metadata } from "next";
import QRSolutionsPage from "@/components/QRSolutions/QRSolutionsPage";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: "QR Code Solutions for Business",
    description:
      "Dynamic QR and NFC solutions for lead capture, virtual business cards, campaigns, and measurable conversion growth.",
    alternates: {
      canonical: toLocaleCanonical("/qr-solutions", locale),
      languages: getLanguageAlternates("/qr-solutions"),
    },
  };
}

export default function Page() {
  return <QRSolutionsPage />;
}
