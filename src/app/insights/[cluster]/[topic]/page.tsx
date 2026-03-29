import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../Insights.module.css";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import {
  getTopicBySlugs,
  TOPIC_CLUSTER_CONTENT_KEY,
  resolveTopicClusters,
} from "@/lib/seo/topicClusters";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { localizeHref } from "@/lib/i18n/path";

type PageProps = {
  params: Promise<{ cluster: string; topic: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster, topic } = await params;
  const locale = await getRequestLocale();
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    locale,
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

  const basePath = `/insights/${data.cluster.slug}/${data.topic.slug}`;
  const canonical = toLocaleCanonical(basePath, locale);

  return {
    title: `${data.topic.title} Guide | ${data.cluster.title}`,
    description: data.topic.summary,
    keywords: [
      ...data.topic.intentKeywords,
      ...data.topic.supportQueries,
      data.cluster.title,
      "implementation guide",
      "business outcome",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates(basePath),
    },
    openGraph: {
      title: `${data.topic.title} Guide | ${data.cluster.title}`,
      description: data.topic.summary,
      type: "article",
      url: `https://lordenryque.com${canonical}`,
      siteName: "LOrdEnRYQuE",
      images: ["/assets/LOGO.png"],
      tags: data.topic.intentKeywords,
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.topic.title} Guide | ${data.cluster.title}`,
      description: data.topic.summary,
      images: ["/assets/LOGO.png"],
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { cluster, topic } = await params;
  const locale = await getRequestLocale();
  const content = await fetchQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    locale,
    fallbackToEnglish: true,
  });
  const clusters = resolveTopicClusters(content?.data);
  const data = getTopicBySlugs(cluster, topic, clusters);

  if (!data) {
    notFound();
  }

  const homePath = localizeHref("/", locale);
  const insightsPath = localizeHref("/insights", locale);
  const clusterPath = localizeHref(`/insights/${data.cluster.slug}`, locale);
  const topicPath = localizeHref(`/insights/${data.cluster.slug}/${data.topic.slug}`, locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://lordenryque.com${homePath}` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `https://lordenryque.com${insightsPath}` },
      {
        "@type": "ListItem",
        position: 3,
        name: data.cluster.title,
        item: `https://lordenryque.com${clusterPath}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: data.topic.title,
        item: `https://lordenryque.com${topicPath}`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.topic.title,
    description: data.topic.summary,
    mainEntityOfPage: `https://lordenryque.com${topicPath}`,
    author: {
      "@type": "Person",
      name: data.topic.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "LOrdEnRYQuE",
    },
    dateModified: data.topic.updatedAt,
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
        <Link href={insightsPath} className={styles.link}>Insights</Link> /{" "}
        <Link href={clusterPath} className={styles.link}>{data.cluster.title}</Link> / {data.topic.title}
      </nav>

      <section className={styles.hero}>
        <span className={styles.eyebrow}>{data.cluster.title}</span>
        <h1 className={styles.title}>{data.topic.title}</h1>
        <p className={styles.subtitle}>{data.topic.summary}</p>
        <div className={styles.metaBlock}>
          <span><strong>Author:</strong> {data.topic.author.name}</span>
          <span><strong>Role:</strong> {data.topic.author.title}</span>
          <span><strong>Updated:</strong> {data.topic.updatedAt}</span>
        </div>
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
          <p><strong>Target Query:</strong> {data.topic.targetQuery}</p>
          <p><strong>Support Queries:</strong> {data.topic.supportQueries.join(", ")}</p>
          <div className={styles.meta}>
            {data.topic.intentKeywords.map((keyword) => (
              <span className={styles.pill} key={keyword}>{keyword}</span>
            ))}
          </div>
          <Link
            href={localizeHref("/contact", locale)}
            className={styles.link}
            data-track-event="click_cta"
            data-track-label={`Insights CTA: ${data.topic.title}`}
          >
            {data.topic.ctaLabel}
          </Link>
        </article>
      </section>

      <section className={styles.longForm}>
        <h2>Case Guide</h2>
        {data.topic.caseGuide.map((section) => (
          <article key={section.heading} className={styles.card}>
            <h3>{section.heading}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Proof Signals</h2>
          <ul className={styles.list}>
            {data.topic.proofSignals.map((signal) => (
              <li key={`${signal.label}-${signal.value}`}>
                <strong>{signal.label}:</strong> {signal.value}
              </li>
            ))}
          </ul>
        </article>
        <article className={styles.card}>
          <h2>Testimonials</h2>
          {data.topic.testimonials.map((testimonial) => (
            <blockquote key={`${testimonial.author}-${testimonial.quote}`} className={styles.testimonial}>
              “{testimonial.quote}”
              <footer>
                {testimonial.author} · {testimonial.role}
              </footer>
            </blockquote>
          ))}
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
