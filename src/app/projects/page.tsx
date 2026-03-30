import React from "react";
import { fetchQuery } from "convex/nextjs";
import { ProjectArchive } from "@/components/Projects/ProjectArchive";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { api } from "../../../convex/_generated/api";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/projects", locale);
  const isDe = locale === "de";
  const title = isDe ? "KI- & Web-Fallstudien" : "AI & Web Case Studies";
  const description = isDe
    ? "Reale Projektergebnisse in KI-Produkten, performanten Web-Plattformen und conversion-orientierter Umsetzung."
    : "Real project outcomes across AI products, high-performance web platforms, and conversion-focused digital delivery.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
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
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/realestate-hero.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/realestate-hero.jpg"],
    },
  };
}

export default async function ProjectsPage() {
  const locale = await getRequestLocale();
  const projects = await fetchQuery(api.projects.list, { category: undefined });
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: locale === "de" ? "Projektarchiv" : "Project Archive",
    url: "https://lordenryque.com/projects",
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `https://lordenryque.com/projects/${project.slug}`,
      })),
    },
  };

  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      <ProjectArchive initialProjects={projects} />
    </main>
  );
}
