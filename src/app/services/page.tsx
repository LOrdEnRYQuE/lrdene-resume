import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { ServicesPageClient } from "@/components/Services/ServicesPageClient";
import Link from "next/link";
import { SERVICE_LOCATIONS } from "@/utils/serviceLocations";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { TOPIC_CLUSTER_CONTENT_KEY, resolveTopicClusters } from "@/lib/seo/topicClusters";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { FALLBACK_SERVICES } from "@/lib/servicesFallback";
import styles from "./Services.module.css";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/services", locale);

  return {
    title: "AI & Next.js Development Services",
    description:
      "AI engineering, web architecture, and product delivery services designed to increase conversion, speed, and growth.",
    keywords: [
      "AI development services",
      "Next.js development service",
      "software architecture consulting",
      "custom web app development",
      "digital solutions Germany",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/services"),
    },
    openGraph: {
      title: "AI & Next.js Development Services | LOrdEnRYQuE",
      description:
        "AI engineering, web architecture, and product delivery services designed to increase conversion, speed, and growth.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI & Next.js Development Services | LOrdEnRYQuE",
      description:
        "AI engineering, web architecture, and product delivery services designed to increase conversion, speed, and growth.",
    },
  };
}

export default async function ServicesPage() {
  const [servicesRaw, topicClusterContent] = await Promise.all([
    fetchQuery(api.services.list, {}),
    fetchQuery(api.pages.getPageContent, { key: TOPIC_CLUSTER_CONTENT_KEY, fallbackToEnglish: true }),
  ]);
  const services = servicesRaw.length > 0 ? servicesRaw : FALLBACK_SERVICES;
  const topicClusters = resolveTopicClusters(topicClusterContent?.data);
  const localSeoTargets = [
    { slug: "web-development-landshut", label: "Web Development in Landshut" },
    { slug: "ai-integration-landshut", label: "AI Integration in Landshut" },
    { slug: "ui-ux-design-landshut", label: "UI/UX Design in Landshut" },
  ];

  return (
    <>
      <ServicesPageClient services={services} />
      <section className={`container ${styles.linkHubSection}`}>
        <h2 className={styles.linkHubTitle}>Local SEO Focus Pages</h2>
        <p className={styles.linkHubIntro}>
          Intent-specific landing pages optimized for service + city searches.
        </p>
        <ul className={styles.linkHubList}>
          {localSeoTargets.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/services/${entry.slug}`}
                data-track-event="internal_link_click"
                data-track-label={`Local SEO page: ${entry.label}`}
              >
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className={styles.linkHubTitle}>Location Landing Pages</h2>
        <p className={styles.linkHubIntro}>
          Region-specific delivery pages for local-intent search visibility.
        </p>
        <ul className={styles.linkHubList}>
          {services.flatMap((service) =>
            SERVICE_LOCATIONS.map((location) => (
              <li key={`${service._id}-${location.slug}`}>
                <Link
                  href={`/services/${service.slug}-${location.slug}`}
                  data-track-event="internal_link_click"
                  data-track-label={`Service location: ${service.title} ${location.city}`}
                >
                  {service.title} in {location.city}
                </Link>
              </li>
            )),
          )}
        </ul>

        <h2 className={`${styles.linkHubTitle} ${styles.linkHubTitleWithTopMargin}`}>Topic Clusters</h2>
        <p className={styles.linkHubIntro}>
          Implementation-ready cluster pages that connect services with technical guides.
        </p>
        <ul className={styles.linkHubList}>
          {topicClusters.flatMap((cluster) =>
            cluster.topics.slice(0, 2).map((topic) => (
              <li key={`${cluster.slug}-${topic.slug}`}>
                <Link
                  href={`/insights/${cluster.slug}/${topic.slug}`}
                  data-track-event="internal_link_click"
                  data-track-label={`Services->Insights: ${cluster.title} ${topic.title}`}
                >
                  {topic.title}
                </Link>
              </li>
            )),
          )}
        </ul>
      </section>
    </>
  );
}
