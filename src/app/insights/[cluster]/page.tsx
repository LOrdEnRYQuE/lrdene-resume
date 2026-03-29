import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../Insights.module.css";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import {
  getTopicClusterBySlug,
  TOPIC_CLUSTER_CONTENT_KEY,
  resolveTopicClusters,
} from "@/lib/seo/topicClusters";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { localizeHref } from "@/lib/i18n/path";

type PageProps = {
  params: Promise<{ cluster: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster } = await params;
  const locale = await getRequestLocale();
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    locale,
    fallbackToEnglish: true,
  });
  const clusters = resolveTopicClusters(content?.data);
  const data = getTopicClusterBySlug(cluster, clusters);

  if (!data) {
    return {
      title: "Cluster Not Found",
      robots: { index: false, follow: false },
    };
  }

  const basePath = `/insights/${data.slug}`;
  const canonical = toLocaleCanonical(basePath, locale);

  return {
    title: `${data.title} Playbooks | SEO & AI`,
    description: data.description,
    keywords: [
      data.title,
      ...data.topics.flatMap((topic) => topic.intentKeywords.slice(0, 2)),
      "insights cluster",
      "implementation playbook",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates(basePath),
    },
    openGraph: {
      title: `${data.title} Playbooks | SEO & AI`,
      description: data.description,
      type: "website",
      url: `https://lordenryque.com${canonical}`,
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} Playbooks | SEO & AI`,
      description: data.description,
      images: ["/assets/LOGO.png"],
    },
  };
}

export default async function ClusterPage({ params }: PageProps) {
  const { cluster } = await params;
  const locale = await getRequestLocale();
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    locale,
    fallbackToEnglish: true,
  });
  const clusters = resolveTopicClusters(content?.data);
  const data = getTopicClusterBySlug(cluster, clusters);

  if (!data) {
    notFound();
  }

  const homePath = localizeHref("/", locale);
  const insightsPath = localizeHref("/insights", locale);
  const clusterPath = localizeHref(`/insights/${data.slug}`, locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://lordenryque.com${homePath}` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `https://lordenryque.com${insightsPath}` },
      { "@type": "ListItem", position: 3, name: data.title, item: `https://lordenryque.com${clusterPath}` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${data.title} Topic Cluster`,
    description: data.description,
    url: `https://lordenryque.com${clusterPath}`,
    hasPart: data.topics.map((topic) => ({
      "@type": "Article",
      headline: topic.title,
      url: `https://lordenryque.com${localizeHref(`/insights/${data.slug}/${topic.slug}`, locale)}`,
      description: topic.summary,
    })),
  };

  return (
    <main className={`${styles.page} container`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <nav className={styles.breadcrumb}>
        <Link href={insightsPath} className={styles.link}>Insights</Link> / {data.title}
      </nav>

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Topic Cluster</span>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.subtitle}>{data.description}</p>
      </section>

      <section className={styles.grid}>
        {data.topics.map((topic) => (
          <article key={topic.slug} className={styles.card}>
            <h2>{topic.title}</h2>
            <p>{topic.summary}</p>
            <p><strong>Target Query:</strong> {topic.targetQuery}</p>
            <p><strong>Support Queries:</strong> {topic.supportQueries.join(", ")}</p>
            <div className={styles.meta}>
              {topic.intentKeywords.map((keyword) => (
                <span className={styles.pill} key={keyword}>{keyword}</span>
              ))}
            </div>
            <Link
              href={localizeHref(`/insights/${data.slug}/${topic.slug}`, locale)}
              className={styles.link}
              data-track-event="internal_link_click"
              data-track-label={`Insights cluster->topic: ${data.title} ${topic.title}`}
            >
              Open Template
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
