import React from "react";
import { ProjectArchive } from "@/components/Projects/ProjectArchive";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/projects", locale);

  return {
    title: "AI & Web Case Studies",
    description: "Real project outcomes across AI products, high-performance web platforms, and conversion-focused digital delivery.",
    keywords: [
      "software case studies",
      "AI project portfolio",
      "web development portfolio",
      "Next.js case study",
      "digital product delivery",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/projects"),
    },
    openGraph: {
      title: "AI & Web Case Studies | LOrdEnRYQuE",
      description: "Real project outcomes across AI products, high-performance web platforms, and conversion-focused digital delivery.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI & Web Case Studies | LOrdEnRYQuE",
      description: "Real project outcomes across AI products, high-performance web platforms, and conversion-focused digital delivery.",
      images: ["/assets/LOGO.png"],
    },
  };
}

export default function ProjectsPage() {
  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <ProjectArchive />
    </main>
  );
}
