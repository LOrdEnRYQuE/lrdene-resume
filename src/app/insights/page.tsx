import type { Metadata } from "next";
import Link from "next/link";
import styles from "./Insights.module.css";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { TOPIC_CLUSTER_CONTENT_KEY, resolveTopicClusters } from "@/lib/seo/topicClusters";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/insights", locale);

  return {
    title: "Insights | Topic Clusters",
    description:
      "Template-driven topic clusters for web development, AI automation, analytics, SEO, and growth operations.",
    alternates: {
      canonical,
      languages: getLanguageAlternates("/insights"),
    },
    openGraph: {
      title: "Insights | LOrdEnRYQuE",
      description:
        "Template-driven topic clusters for web development, AI automation, analytics, SEO, and growth operations.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
    },
  };
}

export default async function InsightsPage() {
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    fallbackToEnglish: true,
  });
  const clusters = resolveTopicClusters(content?.data);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Insights Topic Clusters",
    url: "https://lordenryque.com/insights",
    hasPart: clusters.map((cluster) => ({
      "@type": "CollectionPage",
      name: cluster.title,
      url: `https://lordenryque.com/insights/${cluster.slug}`,
    })),
  };

  return (
    <main className={`${styles.page} container`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Growth Architecture</span>
        <h1 className={styles.title}>Template-Driven Topic Clusters</h1>
        <p className={styles.subtitle}>
          Structured landing pages built around buyer intent, technical implementation paths, and measurable outcomes.
        </p>
      </section>

      <section className={styles.grid}>
        {clusters.map((cluster) => (
          <article key={cluster.slug} className={styles.card}>
            <h2>{cluster.title}</h2>
            <p>{cluster.description}</p>
            <ul className={styles.list}>
              {cluster.topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    className={styles.link}
                    href={`/insights/${cluster.slug}/${topic.slug}`}
                    data-track-event="internal_link_click"
                    data-track-label={`Insights index->topic: ${cluster.title} ${topic.title}`}
                  >
                    {topic.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              className={styles.link}
              href={`/insights/${cluster.slug}`}
              data-track-event="internal_link_click"
              data-track-label={`Insights index->cluster: ${cluster.title}`}
            >
              Explore {cluster.title}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
