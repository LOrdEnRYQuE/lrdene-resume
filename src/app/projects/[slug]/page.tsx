import React from "react";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { Footer } from "@/components/Footer/Footer";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await fetchQuery(api.projects.getBySlug, { slug: params.slug });
  if (!project) return {};

  return {
    title: `${project.title} | Case Study`,
    description: project.summary,
    openGraph: {
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await fetchQuery(api.projects.getBySlug, { slug: params.slug });
  if (!project) notFound();

  return (
    <main style={{ marginTop: "80px" }}>
      <ProjectDetail slug={params.slug} />
      <Footer />
    </main>
  );
}
