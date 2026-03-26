import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { ServicesPageClient } from "@/components/Services/ServicesPageClient";
import Link from "next/link";
import { SERVICE_LOCATIONS } from "@/utils/serviceLocations";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { TOPIC_CLUSTER_CONTENT_KEY, resolveTopicClusters } from "@/lib/seo/topicClusters";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Premium AI engineering, full-stack architecture, and high-performance digital product services.",
  alternates: {
    canonical: "/services",
    languages: getLanguageAlternates("/services"),
  },
  openGraph: {
    title: "Services | LOrdEnRYQuE",
    description:
      "Premium AI engineering, full-stack architecture, and high-performance digital product services.",
    url: "https://lrdene.com/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  const [services, topicClusterContent] = await Promise.all([
    fetchQuery(api.services.list, {}),
    fetchQuery(api.pages.getPageContent, { key: TOPIC_CLUSTER_CONTENT_KEY, fallbackToEnglish: true }),
  ]);
  const topicClusters = resolveTopicClusters(topicClusterContent?.data);
  return (
    <>
      <ServicesPageClient services={services} />
      <section className="container" style={{ marginTop: "2rem", marginBottom: "5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Location Landing Pages</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Region-specific delivery pages for local-intent search visibility.
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {services.slice(0, 4).flatMap((service) =>
            SERVICE_LOCATIONS.slice(0, 2).map((location) => (
              <Link
                key={`${service._id}-${location.slug}`}
                href={`/services/${service.slug}-${location.slug}`}
                data-track-event="internal_link_click"
                data-track-label={`Service location: ${service.title} ${location.city}`}
              >
                {service.title} in {location.city}
              </Link>
            )),
          )}
        </div>

        <h2 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Topic Clusters</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Implementation-ready cluster pages that connect services with technical guides.
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {topicClusters.flatMap((cluster) =>
            cluster.topics.slice(0, 2).map((topic) => (
              <Link
                key={`${cluster.slug}-${topic.slug}`}
                href={`/insights/${cluster.slug}/${topic.slug}`}
                data-track-event="internal_link_click"
                data-track-label={`Services->Insights: ${cluster.title} ${topic.title}`}
              >
                {topic.title}
              </Link>
            )),
          )}
        </div>
      </section>
    </>
  );
}
