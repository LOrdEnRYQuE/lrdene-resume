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
    title: "Project Archive",
    description: "A comprehensive collection of digital products, AI solutions, and design case studies by LOrdEnRYQuE.",
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
      title: "Project Archive | LOrdEnRYQuE",
      description: "A comprehensive collection of digital products, AI solutions, and design case studies by LOrdEnRYQuE.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Project Archive | LOrdEnRYQuE",
      description: "A comprehensive collection of digital products, AI solutions, and design case studies by LOrdEnRYQuE.",
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
