// export const runtime = "edge";

import React from "react";
import { About } from "@/components/About/About";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: "About",
    description: "Learn about Attila Lazar, the engineer and designer behind LOrdEnRYQuE.",
    alternates: {
      canonical: toLocaleCanonical("/about", locale),
      languages: getLanguageAlternates("/about"),
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
