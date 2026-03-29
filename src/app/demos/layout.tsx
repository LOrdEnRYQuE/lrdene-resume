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

  return {
    title: "Interactive Demos",
    description:
      "Live demo gallery for AI products, SaaS interfaces, e-commerce, and conversion-focused digital experiences.",
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
      title: "Interactive Demos | LOrdEnRYQuE",
      description:
        "Live demo gallery for AI products, SaaS interfaces, e-commerce, and conversion-focused digital experiences.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Interactive Demos | LOrdEnRYQuE",
      description:
        "Live demo gallery for AI products, SaaS interfaces, e-commerce, and conversion-focused digital experiences.",
      images: ["/assets/LOGO.png"],
    },
  };
}

export default function DemosLayout({ children }: Props) {
  return children;
}
