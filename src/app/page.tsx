import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";

import { Hero } from "@/components/Hero/Hero";
import { TrustStrip } from "@/components/TrustStrip/TrustStrip";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { LOCALE_HEADER_NAME, type Locale, isLocale } from "@/lib/i18n/config";
import {
  getFeaturedProjectsCached,
} from "@/lib/server/cachedQueries";

const ServicesGrid = dynamic(
  () => import("@/components/ServicesGrid/ServicesGrid").then((m) => m.ServicesGrid),
);
const FeaturedProjects = dynamic(
  () => import("@/components/Projects/FeaturedProjects").then((m) => m.FeaturedProjects),
);
const About = dynamic(
  () => import("@/components/About/About").then((m) => m.About),
);
const ProcessSection = dynamic(
  () => import("@/components/ProcessSection/ProcessSection").then((m) => m.ProcessSection),
);
const FinalCTA = dynamic(
  () => import("@/components/FinalCTA/FinalCTA").then((m) => m.FinalCTA),
);
export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale: Locale = isLocale(localeHeader) ? localeHeader : "en";
  const isDe = locale === "de";
  const title = "Custom Websites and Web Products";
  const description = isDe
    ? "LOrdEnRYQuE entwickelt performante Websites und individuelle Web-Produkte für Unternehmen, die einen professionellen digitalen Auftritt, mehr Vertrauen und bessere Conversion brauchen."
    : "LOrdEnRYQuE builds high-performance websites and custom web products for businesses that need a premium digital presence, stronger trust, and better conversion.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "custom websites",
      "web products for businesses",
      "business website developer Germany",
      "custom web app development",
      "client portals",
      "AI integration",
    ],
    alternates: {
      canonical: "/",
      languages: getLanguageAlternates("/"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: "https://lordenryque.com/",
      type: "website",
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

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Attila Lazar",
  url: "https://lordenryque.com",
  jobTitle: "Web Developer",
  description:
    "Builds custom websites and web-based business products with a focus on performance, clarity, and conversion.",
  sameAs: [
    "https://www.linkedin.com/in/LOrdEnRQuE",
    "https://www.facebook.com/LOrdEnRYQuEit",
    "https://www.tiktok.com/@LOrdEnRYQuE",
  ],
};

export default async function Home() {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale: Locale = isLocale(localeHeader) ? localeHeader : "en";
  const featuredProjects = await getFeaturedProjectsCached();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Hero locale={locale} />
      <ServicesGrid locale={locale} />
      <FeaturedProjects locale={locale} featuredProjects={featuredProjects ?? []} />
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "1400px" }}>
        <ProcessSection locale={locale} />
      </section>
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "960px" }}>
        <TrustStrip locale={locale} />
      </section>
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "1400px" }}>
        <About />
      </section>
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "520px" }}>
        <FinalCTA locale={locale} />
      </section>
    </main>
  );
}
