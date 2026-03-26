import type { Metadata } from "next";
import QRSolutionsPage from "@/components/QRSolutions/QRSolutionsPage";
import { getLanguageAlternates } from "@/lib/seo/alternates";

export const metadata: Metadata = {
  title: "QR Code Solutions for Business",
  description:
    "Dynamic QR and NFC solutions for lead capture, virtual business cards, campaigns, and measurable conversion growth.",
  alternates: {
    canonical: "/qr-solutions",
    languages: getLanguageAlternates("/qr-solutions"),
  },
};

export default function Page() {
  return <QRSolutionsPage />;
}
