import type { Metadata } from "next";
import Link from "next/link";
import styles from "./Insights.module.css";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { TOPIC_CLUSTER_CONTENT_KEY, resolveTopicClusters } from "@/lib/seo/topicClusters";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { localizeHref } from "@/lib/i18n/path";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/insights", locale);
  const isDe = locale === "de";
  const title = isDe ? "SEO-, KI- & Web-Growth-Playbooks" : "SEO, AI & Web Growth Playbooks";
  const description = isDe
    ? "Topic-Cluster-Playbooks für SEO, KI-Automation, Webentwicklung und messbare Wachstumsprozesse."
    : "Topic-cluster playbooks for SEO, AI automation, web development, and measurable growth operations.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "topic clusters",
      "programmatic SEO content",
      "AI automation insights",
      "web development strategy",
      "growth operations playbooks",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/insights"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/ai-dashboard-hero.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/ai-dashboard-hero.png"],
    },
  };
}

export default async function InsightsPage() {
  const locale = await getRequestLocale();
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    locale,
    fallbackToEnglish: true,
  });
  const clusters = resolveTopicClusters(content?.data);
  const insightsPath = localizeHref("/insights", locale);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Insights Topic Clusters",
    url: `https://lordenryque.com${insightsPath}`,
    hasPart: clusters.map((cluster) => ({
      "@type": "CollectionPage",
      name: cluster.title,
      url: `https://lordenryque.com${localizeHref(`/insights/${cluster.slug}`, locale)}`,
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
                    href={localizeHref(`/insights/${cluster.slug}/${topic.slug}`, locale)}
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
              href={localizeHref(`/insights/${cluster.slug}`, locale)}
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
