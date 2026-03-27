// export const runtime = "edge";

import React from "react";
import { About } from "@/components/About/About";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/about", locale);

  return {
    title: "About",
    description: "Learn about Attila Lazar, the engineer and designer behind LOrdEnRYQuE.",
    keywords: [
      "Attila Lazar",
      "AI engineer profile",
      "full-stack developer Germany",
      "software architect portfolio",
      "LOrdEnRYQuE",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/about"),
    },
    openGraph: {
      title: "About | LOrdEnRYQuE",
      description: "Learn about Attila Lazar, the engineer and designer behind LOrdEnRYQuE.",
      url: `https://lordenryque.com${canonical}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: "About | LOrdEnRYQuE",
      description: "Learn about Attila Lazar, the engineer and designer behind LOrdEnRYQuE.",
    },
  };
}

export default function AboutPage() {
  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <About />
    </main>
  );
}
