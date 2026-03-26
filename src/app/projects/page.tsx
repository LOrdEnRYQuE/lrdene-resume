import React from "react";
import { ProjectArchive } from "@/components/Projects/ProjectArchive";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";

export const metadata: Metadata = {
  title: "Project Archive",
  description: "A comprehensive collection of digital products, AI solutions, and design case studies by LOrdEnRYQuE.",
  alternates: {
    canonical: "/projects",
    languages: getLanguageAlternates("/projects"),
  },
};

export default function ProjectsPage() {
  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <ProjectArchive />
    </main>
  );
}
