import React from "react";
import { ProjectArchive } from "@/components/Projects/ProjectArchive";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: "Project Archive",
    description: "A comprehensive collection of digital products, AI solutions, and design case studies by LOrdEnRYQuE.",
    alternates: {
      canonical: toLocaleCanonical("/projects", locale),
      languages: getLanguageAlternates("/projects"),
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
