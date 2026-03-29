// export const runtime = "edge";

import React from "react";
import { Contact } from "@/components/Contact/Contact";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { BUSINESS_PROFILE } from "@/lib/businessProfile";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/contact", locale);
  const isDe = locale === "de";
  const title = isDe ? "Projekt starten" : "Start Your Project";
  const description = isDe
    ? `Sprich mit ${BUSINESS_PROFILE.name} über KI-Systeme, Web-Architektur und wachstumsorientierte digitale Lösungen.`
    : `Talk with ${BUSINESS_PROFILE.name} about AI systems, web architecture, and growth-focused digital solutions. Remote-first from Germany (${BUSINESS_PROFILE.timezone}).`;
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "contact AI engineer",
      "hire Next.js developer",
      "software architect consultation",
      "web development Germany",
      "digital solutions contact",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/contact"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/LOGO.png"],
    },
  };
}

export default function ContactPage() {
  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <Contact />
    </main>
  );
}
