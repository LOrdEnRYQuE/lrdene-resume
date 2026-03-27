import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";

import { Hero, type HeroData } from "@/components/Hero/Hero";
import { TrustStrip } from "@/components/TrustStrip/TrustStrip";
import { Promotions } from "@/components/Promotions/Promotions";
import { DemoBranches } from "@/components/DemoBranches/DemoBranches";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { LOCALE_HEADER_NAME, type Locale, isLocale } from "@/lib/i18n/config";
import {
  getFeaturedProjectsCached,
  getPageContentCached,
  getPublishedPostsCached,
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
const BlogPreview = dynamic(
  () => import("@/components/Blog/BlogPreview").then((m) => m.BlogPreview),
);
const Contact = dynamic(
  () => import("@/components/Contact/Contact").then((m) => m.Contact),
);
const FinalCTA = dynamic(
  () => import("@/components/FinalCTA/FinalCTA").then((m) => m.FinalCTA),
);

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  const locale: Locale = isLocale(localeHeader) ? localeHeader : "en";

  return {
    title: "LOrdEnRYQuE | Advanced Digital Solution",
    description:
      "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
    keywords: [
      "AI engineer Germany",
      "Next.js developer Germany",
      "full-stack engineer",
      "software architecture consulting",
      "web development Landshut",
      "digital solutions",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: getLanguageAlternates("/"),
    },
    openGraph: {
      title: "LOrdEnRYQuE | Advanced Digital Solution",
      description:
        "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
      url: `https://lordenryque.com/${locale}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "LOrdEnRYQuE | Advanced Digital Solution",
      description:
        "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
    },
  };
}

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Attila Lazar",
  url: "https://lordenryque.com",
  jobTitle: "Senior Full-Stack Engineer",
  description:
    "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
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
  const [heroContent, promotionsContent, featuredProjects, posts] = await Promise.all([
    getPageContentCached("home_hero", locale, true),
    getPageContentCached("home_promotions", locale, true),
    getFeaturedProjectsCached(),
    getPublishedPostsCached(),
  ]);
  const heroData = (heroContent?.data ?? null) as Partial<HeroData> | null;
  const promotionsData = (promotionsContent?.data ?? null) as
    | {
        eyebrow?: string;
        titleA?: string;
        titleB?: string;
        subtitle?: string;
        note?: string;
        cta?: string;
        tiers?: Array<{ off?: string; stage?: string }>;
      }
    | null;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Hero locale={locale} content={heroData} />
      <Promotions locale={locale} content={promotionsData} />
      <TrustStrip locale={locale} />
      <DemoBranches locale={locale} />
      <ServicesGrid locale={locale} />
      <FeaturedProjects locale={locale} featuredProjects={featuredProjects ?? []} />
      <About />
      <ProcessSection locale={locale} />
      <BlogPreview locale={locale} posts={posts ?? []} />
      <Contact />
      <FinalCTA locale={locale} />
    </main>
  );
}
