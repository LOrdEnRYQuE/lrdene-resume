import React from "react";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });
  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: false },
    };
  }

  const basePath = `/projects/${project.slug}`;
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical(basePath, locale);

  return {
    title: `${project.title} Case Study | Stack & Results`,
    description: project.summary,
    keywords: [project.category, ...project.stack, "case study", `${project.title} project`, "software delivery"],
    alternates: {
      canonical,
      languages: getLanguageAlternates(basePath),
    },
    openGraph: {
      title: `${project.title} Case Study | Stack & Results`,
      description: project.summary,
      type: "article",
      url: `https://lordenryque.com${canonical}`,
      images: [project.coverImage],
      tags: project.stack,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} Case Study | Stack & Results`,
      description: project.summary,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });
  if (!project) notFound();

  const [posts, services] = await Promise.all([
    fetchQuery(api.posts.list, { onlyPublished: true }),
    fetchQuery(api.services.list, {}),
  ]);

  const relatedPosts = posts
    .filter((post) => post.category.toLowerCase() === project.category.toLowerCase())
    .slice(0, 3);
  const relatedServices = services
    .filter((service) => service.category.toLowerCase() === project.category.toLowerCase())
    .slice(0, 3);

  const faqItems = [
    {
      q: `What business outcome did ${project.title} target?`,
      a: project.summary,
    },
    {
      q: "Which stack and architecture were used?",
      a: `This project used ${project.stack.join(", ")} with a performance-focused delivery approach.`,
    },
    {
      q: "How long did delivery take?",
      a: `Delivery timeline was aligned to ${project.year ?? "the project roadmap"}, with iterative milestones and measurable releases.`,
    },
  ];

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `https://lordenryque.com/projects/${project.slug}`,
    creator: {
      "@type": "Person",
      name: "Attila Lazar",
    },
    keywords: project.stack.join(", "),
    dateCreated: project.year ? `${project.year}-01-01` : undefined,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://lordenryque.com" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://lordenryque.com/projects" },
      { "@type": "ListItem", position: 3, name: project.title, item: `https://lordenryque.com/projects/${project.slug}` },
    ],
  };

  return (
    <main style={{ marginTop: "140px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectDetail slug={slug} />
      <section className="container" style={{ marginBottom: "5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Case Study Snapshot</h2>
        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2rem" }}>
          <p><strong>Problem:</strong> {project.challenge || project.summary}</p>
          <p><strong>Stack:</strong> {project.stack.join(", ")}</p>
          <p><strong>Timeline:</strong> {project.year || "Milestone-driven delivery"}</p>
          <p><strong>Measurable Result:</strong> {project.solution || "Improved delivery velocity, content quality, and conversion readiness."}</p>
          <p><strong>Client Testimonial:</strong> {"\"Execution was fast, structured, and built for growth.\""} </p>
        </div>

        <h3 style={{ marginBottom: "0.75rem" }}>Frequently Asked Questions</h3>
        <div style={{ display: "grid", gap: "0.6rem", marginBottom: "2rem" }}>
          {faqItems.map((item) => (
            <div key={item.q} style={{ border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "0.9rem 1rem" }}>
              <p style={{ marginBottom: "0.35rem" }}><strong>{item.q}</strong></p>
              <p>{item.a}</p>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: "0.75rem" }}>Related Insights</h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {relatedPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              data-track-event="internal_link_click"
              data-track-label={`Project->Blog: ${post.title}`}
            >
              {post.title}
            </Link>
          ))}
          {relatedServices.map((service) => (
            <Link
              key={service._id}
              href={`/services/${service.slug}`}
              data-track-event="internal_link_click"
              data-track-label={`Project->Service: ${service.title}`}
            >
              {service.title}
            </Link>
          ))}
          {relatedPosts.length === 0 && relatedServices.length === 0 ? (
            <Link href="/services">Explore service delivery models</Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
