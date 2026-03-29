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
  const isDe = locale === "de";
  const title = isDe ? "Über Attila Lazar" : "About Attila Lazar";
  const description = isDe
    ? "Lerne den Engineer hinter LOrdEnRYQuE kennen: KI-Systeme, Full-Stack-Architektur und hochwertige Produktumsetzung."
    : "Meet the engineer behind LOrdEnRYQuE: AI systems, full-stack architecture, and premium digital product delivery.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
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
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "profile",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/Profile.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/Profile.webp"],
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
