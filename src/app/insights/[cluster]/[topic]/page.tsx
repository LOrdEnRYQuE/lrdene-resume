import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../Insights.module.css";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import {
  getAllTopicClusterPaths,
  getTopicBySlugs,
  TOPIC_CLUSTER_CONTENT_KEY,
  TOPIC_CLUSTERS,
  resolveTopicClusters,
} from "@/lib/seo/topicClusters";

type PageProps = {
  params: Promise<{ cluster: string; topic: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster, topic } = await params;
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    fallbackToEnglish: true,
  });
  const clusters = resolveTopicClusters(content?.data);
  const data = getTopicBySlugs(cluster, topic, clusters);

  if (!data) {
    return {
      title: "Insight Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/insights/${data.cluster.slug}/${data.topic.slug}`;

  return {
    title: `${data.topic.title} | ${data.cluster.title}`,
    description: data.topic.summary,
    keywords: [...data.topic.intentKeywords, data.cluster.title, "implementation guide"],
    alternates: {
      canonical,
      languages: getLanguageAlternates(canonical),
    },
    openGraph: {
      title: `${data.topic.title} | ${data.cluster.title}`,
      description: data.topic.summary,
      type: "article",
      url: `https://lrdene.com${canonical}`,
      tags: data.topic.intentKeywords,
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.topic.title} | ${data.cluster.title}`,
      description: data.topic.summary,
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { cluster, topic } = await params;
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    fallbackToEnglish: true,
  });
  const clusters = resolveTopicClusters(content?.data);
  const data = getTopicBySlugs(cluster, topic, clusters);

  if (!data) {
    notFound();
  }

  const path = `/insights/${data.cluster.slug}/${data.topic.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://lrdene.com" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "https://lrdene.com/insights" },
      {
        "@type": "ListItem",
        position: 3,
        name: data.cluster.title,
        item: `https://lrdene.com/insights/${data.cluster.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: data.topic.title,
        item: `https://lrdene.com${path}`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.topic.title,
    description: data.topic.summary,
    mainEntityOfPage: `https://lrdene.com${path}`,
    author: {
      "@type": "Organization",
      name: "LOrdEnRYQuE",
    },
    publisher: {
      "@type": "Organization",
      name: "LOrdEnRYQuE",
    },
    keywords: data.topic.intentKeywords.join(", "),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.topic.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className={styles.breadcrumb}>
        <Link href="/insights" className={styles.link}>Insights</Link> /{" "}
        <Link href={`/insights/${data.cluster.slug}`} className={styles.link}>{data.cluster.title}</Link> / {data.topic.title}
      </nav>

      <section className={styles.hero}>
        <span className={styles.eyebrow}>{data.cluster.title}</span>
        <h1 className={styles.title}>{data.topic.title}</h1>
        <p className={styles.subtitle}>{data.topic.summary}</p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Business Outcome</h2>
          <p>{data.topic.businessOutcome}</p>
        </article>

        <article className={styles.card}>
          <h2>Implementation Path</h2>
          <ol className={styles.list}>
            {data.topic.implementationPath.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className={styles.card}>
          <h2>Intent Keywords</h2>
          <div className={styles.meta}>
            {data.topic.intentKeywords.map((keyword) => (
              <span className={styles.pill} key={keyword}>{keyword}</span>
            ))}
          </div>
          <Link
            href="/contact"
            className={styles.link}
            data-track-event="click_cta"
            data-track-label={`Insights CTA: ${data.topic.title}`}
          >
            {data.topic.ctaLabel}
          </Link>
        </article>
      </section>

      <section className={styles.faqGrid}>
        {data.topic.faqs.map((faq) => (
          <article key={faq.question} className={styles.card}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
