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

  return {
    title: "Digital Store",
    description:
      "Premium digital assets: templates, UI kits, and engineering blueprints for modern product teams.",
    keywords: [
      "digital assets store",
      "Next.js templates",
      "UI kits",
      "engineering blueprints",
      "premium design systems",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/store"),
    },
    openGraph: {
      title: "Digital Store | LOrdEnRYQuE",
      description:
        "Premium digital assets: templates, UI kits, and engineering blueprints for modern product teams.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Digital Store | LOrdEnRYQuE",
      description:
        "Premium digital assets: templates, UI kits, and engineering blueprints for modern product teams.",
    },
  };
}

export default function StoreLayout({ children }: Props) {
  return children;
}
