import React from "react";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { Footer } from "@/components/Footer/Footer";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });
  if (!project) return {};

  return {
    title: `${project.title} | Case Study`,
    description: project.summary,
    openGraph: {
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });
  if (!project) notFound();

  return (
    <main style={{ marginTop: "80px" }}>
      <ProjectDetail slug={slug} />
      <Footer />
    </main>
  );
}
