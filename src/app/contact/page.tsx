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
  const title = isDe ? "Projekt starten" : "Start a Project";
  const description = isDe
    ? `Kontaktiere ${BUSINESS_PROFILE.name}, um über deine Website, Web-Plattform oder dein Business-Produkt zu sprechen. Standort Deutschland, Zusammenarbeit in ganz Europa.`
    : `Contact ${BUSINESS_PROFILE.name} to discuss your website, web platform, or business product project. Based in Germany, working with clients across Europe.`;
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "contact AI engineer",
      "hire web developer Germany",
      "website project inquiry",
      "custom web app consultation",
      "business website contact",
      "web platform project",
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
