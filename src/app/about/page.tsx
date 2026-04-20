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
  const title = isDe ? "Über Attila Lazar | Webentwickler hinter LOrdEnRYQuE" : "About Attila Lazar | Web Developer Behind LOrdEnRYQuE";
  const description = isDe
    ? "Lerne Attila Lazar kennen, den Gründer von LOrdEnRYQuE. Ich entwickle individuelle Websites und Web-Produkte mit Fokus auf Performance, Klarheit und Conversion."
    : "Meet Attila Lazar, the founder of LOrdEnRYQuE. I build custom websites and web-based business products with a focus on performance, clarity, and conversion.";
  const socialTitle = title;

  return {
    title: {
      absolute: title,
    },
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
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Attila Lazar",
    alternateName: "LOrdEnRYQuE",
    url: "https://lordenryque.com/about",
    jobTitle: "Senior Full-Stack Engineer",
    knowsAbout: [
      "AI Engineering",
      "Next.js Development",
      "Software Architecture",
      "Conversion-Focused Web Products",
    ],
    worksFor: {
      "@type": "Organization",
      name: "LOrdEnRYQuE | Advanced Digital Solution",
      url: "https://lordenryque.com",
    },
    sameAs: [
      "https://www.linkedin.com/in/LOrdEnRQuE",
      "https://github.com/LOrdEnRYQuE",
    ],
  };

  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <About />
    </main>
  );
}
